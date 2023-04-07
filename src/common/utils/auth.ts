import { SetMetadata } from '@nestjs/common';

export enum GlobalAuthGuardKeys {
  PUBLIC = 'public',
  NORMAL = 'normal',
  WALLET = 'wallett',
  ADMIN = 'admin',
  ORGANIZATION_FOUNDER = 'organization-founder',
}

export const PublicAuth = () => SetMetadata(GlobalAuthGuardKeys.PUBLIC, true);

export const AdminAuth = () => SetMetadata(GlobalAuthGuardKeys.ADMIN, true);

export const WalletAuth = () => SetMetadata(GlobalAuthGuardKeys.WALLET, true);

export const NormalAuth = () => SetMetadata(GlobalAuthGuardKeys.NORMAL, true);

export const OrganizationFounderAuth = () =>
  SetMetadata(GlobalAuthGuardKeys.ORGANIZATION_FOUNDER, true);
