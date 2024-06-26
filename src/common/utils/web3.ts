import { Network, Alchemy } from 'alchemy-sdk';

import { ERROR_MESSAGES } from './messages';
declare global {
  type ChainNames = keyof typeof CHAIN_IDS;
  type SupportedChainIds = (typeof SUPPORTED_CHAIN_IDS)[number];
  type SupportedMainnetChainIds = (typeof SUPPORTED_MAINNET_CHAIN_IDS)[number];
  type SupportedTestnetChainIds = (typeof SUPPORTED_TESTNET_CHAIN_IDS)[number];
}

export const NETWORK_TO_CHAIN_IDS = {
  [Network.ETH_MAINNET]: 1,
  [Network.ETH_GOERLI]: 5,
  [Network.MATIC_MAINNET]: 137,
  [Network.MATIC_MUMBAI]: 80001,
};

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
  [CHAIN_IDS.polygon]: Network.MATIC_MAINNET,
  [CHAIN_IDS.mumbai]: Network.MATIC_MUMBAI,
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

export const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  5: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
  137: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  80001: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
  43114: `https://avalanche-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  43113: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_KEY}`,
};
