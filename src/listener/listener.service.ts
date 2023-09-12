import { BadRequestException, Injectable } from '@nestjs/common';
import { Network } from 'alchemy-sdk';
import { AlchemyMultichainClient } from './alchemy_multichains';
import { ethers } from 'ethers';
import VestingABI from './vestingABI.json';
import { PrismaService } from 'nestjs-prisma';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { RecipeStatus, VestingStatus } from '@prisma/client';
import {
  AlchemyApiKeys,
  AlchemyNetworks,
  CHAIN_IDS,
  NETWORK_TO_CHAIN_IDS,
} from 'src/common/utils/web3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ListenerService {
  alchemyInstance;
  transferIface: ethers.Interface;
  erc20ABI = [
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ];
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.alchemyConfigure();
    this.transferIface = new ethers.Interface(this.erc20ABI);
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
    this.createVestingListener();
  }

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
    const iface = new ethers.Interface(VestingABI);
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
        ],
      ],
    };

    const networks = [
      Network.ETH_MAINNET,
      Network.ETH_GOERLI,
      Network.MATIC_MAINNET,
      Network.MATIC_MUMBAI,
    ];

    networks.map((network) => {
      this.alchemyInstance
        .forNetwork(network)
        .ws.on(claimFilter, async (log: any) => {
          try {
            const { args } = iface.parseLog(log);
            const hash = log.transactionHash;
            if (log.topics[0] === claimFilter.topics[0][0]) {
              await this.updateVestingStatus(
                hash,
                NETWORK_TO_CHAIN_IDS[network]
              );
            } else if (log.topics[0] === claimFilter.topics[0][2]) {
              await this.revokeRecipient(
                hash,
                NETWORK_TO_CHAIN_IDS[network],
                args[0]
              );
            }
          } catch (err) {}
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

  async updateTransactionStatus(id: string) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: 'SUCCESS',
      },
    });
  }

  async updateVestingStatus(hash: string, chainId: number) {
    const transaction = await this.getTransaction(hash, chainId);

    const vesting = await this.prisma.vesting.findFirst({
      where: {
        transactionId: transaction.id,
      },
    });
    if (!vesting) {
      throw new BadRequestException(ERROR_MESSAGES.VESTING_NOT_FOUND);
    }

    const [newTransaction, newVesting] = await Promise.all([
      this.updateTransactionStatus(transaction.id),
      this.prisma.vesting.update({
        where: {
          id: vesting.id,
        },
        data: {
          status: VestingStatus.SUCCESS,
        },
      }),
    ]);

    return {
      transaction: newTransaction,
      vesting: newVesting,
    };
  }

  async revokeRecipient(hash: string, chainId: number, recipient: string) {
    const transaction = await this.getTransaction(hash, chainId);
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        address: {
          contains: recipient,
          mode: 'insensitive',
        },
      },
    });
    if (!recipe) {
      throw new BadRequestException(ERROR_MESSAGES.RECIPIENT_NOT_FOUND);
    }

    const revoking = await this.prisma.revoking.findFirst({
      where: {
        transactionId: transaction.id,
      },
    });
    if (!revoking) {
      throw new BadRequestException(ERROR_MESSAGES.REVOKING_NOT_FOUND);
    }

    const [newTransaction, newRecipe, newRevoking] = await Promise.all([
      this.updateTransactionStatus(transaction.id),
      this.prisma.recipe.update({
        where: {
          id: recipe.id,
        },
        data: {
          status: RecipeStatus.REVOKED,
        },
      }),
      this.prisma.revoking.update({
        where: {
          id: revoking.id,
        },
        data: {
          status: 'SUCCESS',
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
}
