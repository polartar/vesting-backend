import { Injectable } from '@nestjs/common';
import { TokenMetadataResponse } from 'alchemy-sdk';
import { getAlchemyClient } from 'src/common/utils/web3';

@Injectable()
export class AlchemyService {
  /**
   * Retrieves the metadata of an ERC20 token contract.
   * @async
   * @function getTokenMetadata
   * @param {string} address - The Ethereum address of the ERC20 token contract.
   * @returns {Promise<TokenMetadataResponse>} - A promise that resolves to an object containing the metadata of the ERC20 token contract, such as its name, symbol, and decimals.
   * @throws {Error} - If an error occurs while retrieving the metadata of the ERC20 token contract.
   * @example
   * const address = '0x123...'; // Replace with the address of the ERC20 token contract you want to retrieve metadata for
   * getTokenMetadata(address)
   *   .then((metadata) => {
   *     console.log(metadata);
   *   })
   *   .catch((error) => {
   *     console.error(error);
   *   });
   */
  async getTokenMetadata(
    address: string,
    networkId: SupportedChainIds
  ): Promise<TokenMetadataResponse> {
    try {
      const alchemyClient = getAlchemyClient(networkId);
      const metadata = await alchemyClient.core.getTokenMetadata(address);
      return metadata;
    } catch (error) {
      console.error('Getting Token Metadata Error ', error);
      throw error;
    }
  }

  /**
   * Validate ERC20 Token Address
   * @async
   * @returns {Promise<Boolean>} - If token address is ERC20 token address, it returns `true`
   */
  async validateERC20TokenAddress(
    address: string,
    networkId: SupportedChainIds
  ): Promise<{
    metadata?: TokenMetadataResponse;
    validated: boolean;
  }> {
    try {
      const metadata = await this.getTokenMetadata(address, networkId);

      return {
        metadata,
        validated: Number(metadata.decimals) > 0,
      };
    } catch (error) {
      console.error('Validating ERC20 Token Address Error: ', error);
      return {
        validated: false,
      };
    }
  }
}
