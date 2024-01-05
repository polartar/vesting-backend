import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Network } from 'alchemy-sdk';
import { AlchemyMultichainClient } from './alchemy_multichains';
import { ethers } from 'ethers';
import { PrismaService } from 'nestjs-prisma';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import {
  RecipeStatus,
  TransactionType,
  VestingContractStatus,
  VestingStatus,
} from '@prisma/client';
import { AlchemyNetworks, NETWORK_TO_CHAIN_IDS } from 'src/common/utils/web3';
import { ConfigService } from '@nestjs/config';
import { isProduction } from 'src/common/utils/api';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class ListenerService implements OnModuleInit {
  alchemyInstance;
  static initialized = false;
  transferIface: ethers.Interface;
  erc20ABI = [
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ];
  networks = [
    Network.ETH_MAINNET,
    Network.ETH_GOERLI,
    Network.MATIC_MAINNET,
    Network.MATIC_MUMBAI,
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private notificationGateway: NotificationGateway
  ) {
    this.alchemyConfigure();
    this.transferIface = new ethers.Interface(this.erc20ABI);
  }

  async onModuleInit() {
    if (
      this.configService.get('NODE_ENV') === 'test' ||
      this.configService.get('NODE_ENV') === 'staging'
    ) {
      return;
    }
    if (!ListenerService.initialized) {
      this.createVestingListener();
      ListenerService.initialized = true;
    }
  }

  alchemyConfigure() {
    const mainnetKey = this.configService.get('ETHEREUM_ALCHEMY_API_KEY');
    const goerliKey = this.configService.get('GOERLI_ALCHEMY_API_KEY');
    const maticKey = this.configService.get('POLYGON_ALCHEMY_API_KEY');
    const mumbaiKey = this.configService.get('MUMBAI_ALCHEMY_API_KEY');

    const defaultConfig = {
      apiKey: mainnetKey,
      network: Network.ETH_MAINNET,
    };
    const overrides = {
      [Network.ETH_GOERLI]: { apiKey: goerliKey, maxRetries: 2 },
      [Network.MATIC_MAINNET]: { apiKey: maticKey, maxRetries: 2 },
      [Network.MATIC_MUMBAI]: { apiKey: mumbaiKey, maxRetries: 2 },
    };

    this.alchemyInstance = new AlchemyMultichainClient(
      defaultConfig,
      overrides
    );
  }

  closeAllListeners = async () => {
    await Promise.all(
      this.networks.map((network) =>
        this.alchemyInstance.forNetwork(network).ws.removeAllListeners()
      )
    );
  };

  createTransferListener = (
    fromAddress: string,
    chainId: SupportedChainIds
  ) => {
    const transferFilter = {
      address: fromAddress,
      topics: [ethers.id('Transfer(address,address,uint256)')],
    };

    this.alchemyInstance
      .forNetwork(AlchemyNetworks[chainId])
      .ws.on(transferFilter, async (log: any) => {
        try {
          const { args } = this.transferIface.parseLog(log);
          await this.updateVestingContractBalance(
            log.transactionHash,
            args.from,
            args.to,
            args.value,
            chainId
          );
        } catch (err) {}
      });
  };

  createVestingListener = () => {
    // const iface = new ethers.Interface(VestingABI);
    const safeIface = new ethers.Interface([
      'event ExecutionSuccess(bytes32,uint256)',
      'event ApproveHash(bytes32)',
    ]);

    const claimFilter = {
      topics: [
        [
          ethers.id(
            'ClaimCreated(address,(uint40,uint40,uint40,uint40,uint256,uint256,uint112,bool,uint40),uint256)'
          ),
          ethers.id('Claimed(address,uint256,uint256)'),
          ethers.id(
            'ClaimRevoked(address,uint256,uint256,(uint40,uint40,uint40,uint40,uint256,uint256,uint112,bool,uint40),uint256)'
          ),
          ethers.id('ExecutionSuccess(bytes32,uint256)'),
          ethers.id('ApproveHash(bytes32)'),
        ],
      ],
    };

    const networks = isProduction
      ? [Network.ETH_MAINNET, Network.MATIC_MAINNET]
      : [Network.ETH_GOERLI, Network.MATIC_MUMBAI];

    networks.map((network) => {
      this.alchemyInstance
        .forNetwork(network)
        .ws.on(claimFilter, async (log: any) => {
          try {
            const hash = log.transactionHash;
            if (log.topics.includes(claimFilter.topics[0][3])) {
              const { args } = safeIface.parseLog(log);
              const safeHash = args[0];
              await this.handleSafeTransactionEvent(
                safeHash,
                NETWORK_TO_CHAIN_IDS[network]
              );
            }
            if (log.topics.includes(claimFilter.topics[0][4])) {
              const { args } = safeIface.parseLog(log);
              const safeHash = args[0];
              await this.handleSafeApproveEvent(
                safeHash,
                NETWORK_TO_CHAIN_IDS[network]
              );
            } else {
              // const { args } = iface.parseLog(log);

              if (log.topics[0] === claimFilter.topics[0][0]) {
                await this.handleCreateClaimEvent(
                  hash,
                  NETWORK_TO_CHAIN_IDS[network]
                );
              } else if (log.topics[0] === claimFilter.topics[0][2]) {
                await this.handleRevokeClaimEvent(
                  hash,
                  NETWORK_TO_CHAIN_IDS[network]
                );
              }
            }
          } catch (err) {
            console.log(err);
          }
        });
      return;
    });
  };

  async getTransaction(hash: string, chainId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        hash: {
          contains: hash,
          mode: 'insensitive',
        },
        chainId,
      },
    });
    if (!transaction) {
      throw new BadRequestException(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
    }

    return transaction;
  }

  async getSafeTransaction(hash: string, chainId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        safeHash: {
          contains: hash,
          mode: 'insensitive',
        },
        chainId,
      },
    });
    if (!transaction) {
      return null;
    }

    return transaction;
  }

  async updateTransactionStatus(id: string) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: 'SUCCESS',
      },
    });
  }

  async handleCreateClaimEvent(hash: string, chainId: number) {
    const transaction = await this.getTransaction(hash, chainId);
    const { vesting } = await this.updateVestingStatus(transaction.id);

    await this.notificationGateway.notifyClient('adding_claims', {
      vestingId: vesting.id,
      chainId,
    });
  }

  async handleRevokeClaimEvent(hash: string, chainId: number) {
    const transaction = await this.getTransaction(hash, chainId);
    const { recipe } = await this.revokeRecipient(transaction.id);
    await this.notificationGateway.notifyClient('revoking_claim', {
      vestingId: recipe.vestingId,
      recipient: recipe.address,
      chainId,
    });
  }

  async updateVestingStatus(transactionId: string) {
    const vesting = await this.prisma.vesting.findFirst({
      where: {
        transactionId: transactionId,
      },
    });
    if (!vesting) {
      throw new BadRequestException(ERROR_MESSAGES.VESTING_NOT_FOUND);
    }

    const [newTransaction, newVesting] = await Promise.all([
      this.updateTransactionStatus(transactionId),
      this.prisma.vesting.update({
        where: {
          id: vesting.id,
        },
        data: {
          status: VestingStatus.LIVE,
        },
      }),
    ]);

    return {
      transaction: newTransaction,
      vesting: newVesting,
    };
  }

  async updateVestingContractStatus(transactionId: string) {
    const vestingContract = await this.prisma.vestingContract.findFirst({
      where: {
        transactionId: transactionId,
      },
    });
    if (!vestingContract) {
      throw new BadRequestException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
    }

    const [newTransaction, newVestingContract] = await Promise.all([
      this.updateTransactionStatus(transactionId),
      this.prisma.vestingContract.update({
        where: {
          id: vestingContract.id,
        },
        data: {
          status: VestingContractStatus.SUCCESS,
        },
      }),
    ]);

    return {
      transaction: newTransaction,
      vestingContract: newVestingContract,
    };
  }

  async revokeRecipient(transactionId: string) {
    const revoking = await this.prisma.revoking.findFirst({
      where: {
        transactionId: transactionId,
      },
    });
    if (!revoking) {
      throw new BadRequestException(ERROR_MESSAGES.REVOKING_NOT_FOUND);
    }

    const [newTransaction, newRevoking, newRecipe] = await Promise.all([
      this.updateTransactionStatus(transactionId),
      this.prisma.revoking.update({
        where: {
          id: revoking.id,
        },
        data: {
          status: 'SUCCESS',
        },
      }),
      this.prisma.recipe.update({
        where: {
          id: revoking.recipeId,
        },
        data: {
          status: RecipeStatus.REVOKED,
        },
      }),
    ]);

    return {
      transaction: newTransaction,
      recipe: newRecipe,
      revoking: newRevoking,
    };
  }

  async updateVestingContractBalance(
    hash,
    fromAddress: string,
    toAddress: string,
    amount: string,
    chainId
  ) {
    const transaction = await this.getTransaction(hash, chainId);
    this.updateTransactionStatus(transaction.id);

    const contract = await this.prisma.vestingContract.findFirst({
      where: {
        address: { in: [fromAddress, toAddress], mode: 'insensitive' },
      },
    });
    if (contract) {
      const vestingContractAddress = contract.address;
      let balance = +contract.balance || 0;
      if (fromAddress === vestingContractAddress) {
        balance = balance - +ethers.formatEther(amount);
      } else {
        balance = balance + +ethers.formatEther(amount);
      }
      this.prisma.vestingContract.update({
        where: { id: contract.id },
        data: { balance: balance.toString() },
      });
    }
  }

  async handleSafeTransactionEvent(hash: string, chainId: number) {
    const transaction = await this.getSafeTransaction(hash, chainId);
    if (transaction) {
      if (transaction.type === TransactionType.ADDING_CLAIMS) {
        const { vesting } = await this.updateVestingStatus(transaction.id);

        await this.notificationGateway.notifyClient('adding_claims', {
          vestingId: vesting.id,
          chainId,
        });
      } else if (transaction.type === TransactionType.REVOKE_CLAIM) {
        const { recipe } = await this.revokeRecipient(transaction.id);

        await this.notificationGateway.notifyClient('revoking_claim', {
          vestingId: recipe.vestingId,
          recipient: recipe.address,
          chainId,
        });
      } else if (transaction.type === TransactionType.VESTING_DEPLOYMENT) {
        const { vestingContract } = await this.updateVestingContractStatus(
          transaction.id
        );

        await this.notificationGateway.notifyClient('contract_deployment', {
          vestingContractId: vestingContract.id,
          chainId,
        });
      }
    }
  }

  async handleSafeApproveEvent(hash: string, chainId: number) {
    await this.notificationGateway.notifyClient('safe_approve', {
      safeHash: hash,
      chainId,
    });
  }
}
