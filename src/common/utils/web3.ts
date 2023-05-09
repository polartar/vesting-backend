import { Network, Alchemy } from 'alchemy-sdk';
import { ethers } from 'ethers';
import SafeServiceClient, { SafeApiKitConfig } from '@safe-global/api-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';

import { ERROR_MESSAGES } from './messages';

declare global {
  type ChainNames = keyof typeof CHAIN_IDS;
  type SupportedChainIds = (typeof SUPPORTED_CHAIN_IDS)[number];
  type SupportedMainnetChainIds = (typeof SUPPORTED_MAINNET_CHAIN_IDS)[number];
  type SupportedTestnetChainIds = (typeof SUPPORTED_TESTNET_CHAIN_IDS)[number];
}

export const CHAIN_IDS = {
  ethereum: 1,
  goerli: 5,
  polygon: 137,
  mumbai: 80001,
} as const;

export const SUPPORTED_MAINNET_CHAIN_IDS = [
  CHAIN_IDS.ethereum,
  CHAIN_IDS.polygon,
];

export const SUPPORTED_TESTNET_CHAIN_IDS = [CHAIN_IDS.goerli, CHAIN_IDS.mumbai];

export const SUPPORTED_CHAIN_IDS: Array<
  SupportedMainnetChainIds | SupportedTestnetChainIds
> =
  process.env.NODE_ENV === 'production'
    ? SUPPORTED_MAINNET_CHAIN_IDS
    : SUPPORTED_TESTNET_CHAIN_IDS;

// Alchemy Networks
export const AlchemyNetworks = {
  [CHAIN_IDS.ethereum]: Network.ETH_MAINNET,
  [CHAIN_IDS.goerli]: Network.ETH_GOERLI,
  [CHAIN_IDS.polygon]: Network.POLYGONZKEVM_MAINNET,
  [CHAIN_IDS.mumbai]: Network.POLYGONZKEVM_TESTNET,
};

// Alchemy API keys per network
export const AlchemyApiKeys = {
  [CHAIN_IDS.ethereum]: process.env.ETHEREUM_ALCHEMY_API_KEY,
  [CHAIN_IDS.goerli]: process.env.GOERLI_ALCHEMY_API_KEY,
  [CHAIN_IDS.polygon]: process.env.POLYGON_ALCHEMY_API_KEY,
  [CHAIN_IDS.mumbai]: process.env.MUMBAI_ALCHEMY_API_KEY,
};

// Safe Global MultiSig Transaction URLs
export const MultiSigTransactionUrls = {
  [CHAIN_IDS.ethereum]: 'https://safe-transaction.mainnet.gnosis.io',
  [CHAIN_IDS.goerli]: 'https://safe-transaction-goerli.safe.global',
  [CHAIN_IDS.polygon]: 'https://safe-transaction-polygon.safe.global',
  [CHAIN_IDS.mumbai]: 'https://safe-transaction-mumbai.safe.global',
};

// Create Alchemy client instance
export const getAlchemyClient = (chainId: SupportedChainIds): Alchemy => {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
    throw ERROR_MESSAGES.UNSUPPORTED_NETWORK;
  }

  return new Alchemy({
    apiKey: AlchemyApiKeys[chainId],
    network: AlchemyNetworks[chainId],
  });
};

// Create safe client instance
export const getEthersAdapter = () => {
  // return new EthersAdapter({
  //   ethers,
  //   signerOrProvider: undefined,
  // });
};

export const getSafeClient = (chainId: SupportedChainIds) => {
  // if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
  //   throw ERROR_MESSAGES.UNSUPPORTED_NETWORK;
  // }
  // return new SafeServiceClient({
  //   txServiceUrl: MultiSigTransactionUrls[chainId],
  //   ethAdapter: getEthersAdapter(),
  // } as unknown as SafeApiKitConfig);
};
