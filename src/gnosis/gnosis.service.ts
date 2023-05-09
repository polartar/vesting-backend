import { Injectable } from '@nestjs/common';
import { getSafeClient } from 'src/common/utils/web3';

@Injectable()
export class GnosisService {
  async validateSafeWalletAddress(
    address: string,
    chainId: SupportedChainIds
  ): Promise<boolean> {
    // TODO add safe wallet validation
    // const safeClient = getSafeClient(chainId);
    // safeClient.getServiceInfo();
    return true;
  }
}
