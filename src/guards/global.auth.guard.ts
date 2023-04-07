import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User, Wallet } from '@prisma/client';
import { GlobalAuthGuardKeys } from 'src/common/utils/auth';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { ERROR_MESSAGES } from 'src/common/utils/messages';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private user: UsersService,
    private wallet: WalletsService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers?.authorization;

    if (authToken) {
      const token = authToken.split(' ')[1];
      const decodeToken = this.auth.decodeToken(token);

      const user = await this.user.getUser(decodeToken.userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;

      if (decodeToken.walletId) {
        const wallet = await this.wallet.getWallet(decodeToken.walletId);
        request.wallet = wallet;
      }
    }

    if (this.isPublicRequest(context)) return true;

    if (this.isNormalRequest(context, request.user)) return true;

    if (this.isWalletRequest(context, request.wallet)) return true;

    const isOrganizationFounder = await this.isOrganizationFounderRequest(
      context,
      request.user,
      request.params?.organizationId
    );
    if (isOrganizationFounder) return true;

    if (this.isAdminRequest(context, request.user)) return true;

    throw new UnauthorizedException();
  }

  isPublicRequest(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.PUBLIC,
      [context.getHandler(), context.getClass()]
    );
    return isPublic;
  }

  isNormalRequest(context: ExecutionContext, user?: User): boolean {
    const isAuthorized = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.NORMAL,
      [context.getHandler(), context.getClass()]
    );
    if (isAuthorized && !Boolean(user)) throw new UnauthorizedException();

    return true;
  }

  isWalletRequest(context: ExecutionContext, wallet?: Wallet): boolean {
    const isWalletConnected = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.WALLET,
      [context.getHandler(), context.getClass()]
    );
    if (isWalletConnected && !Boolean(wallet))
      throw new UnauthorizedException();

    return true;
  }

  async isOrganizationFounderRequest(
    context: ExecutionContext,
    user: User,
    organizationId: string
  ): Promise<boolean> {
    const isOrganizationFounder = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.ORGANIZATION_FOUNDER,
      [context.getHandler(), context.getClass()]
    );

    if (isOrganizationFounder) {
      if (!organizationId)
        throw new BadRequestException(ERROR_MESSAGES.ORGANIZATION_ID_MISSING);

      const userRole = await this.user.getUserRole(user.id, organizationId);
      if (userRole.role !== Role.FOUNDER) throw new UnauthorizedException();
    }

    return true;
  }

  isAdminRequest(context: ExecutionContext, user: User): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.ADMIN,
      [context.getHandler(), context.getClass()]
    );
    if (isAdmin && !user.isAdmin) throw new UnauthorizedException();

    return true;
  }
}
