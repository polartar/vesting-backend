import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, Role, User, Wallet } from '@prisma/client';
import { GlobalAuthGuardKeys } from 'src/common/utils/auth';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { INDEXER_JWT_SECRET } from 'src/common/utils/constants';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private user: UsersService,
    private wallet: WalletsService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authToken = request.headers?.authorization;

      if (authToken) {
        const token = authToken.split(' ')[1];
        if (token) {
          const decodeToken = this.auth.decodeToken(token);

          const user = await this.user.getUser(decodeToken.userId, {
            withEmail: true,
          });
          if (!user) {
            throw new UnauthorizedException();
          }
          request.user = user;

          if (decodeToken.walletId) {
            const wallet = await this.wallet.getWallet(decodeToken.walletId);
            request.wallet = wallet;
          }
        }
      }

      // If endpoint is public
      if (this.isPublicRequest(context)) return true;

      // If the request is coming with api-key
      if (this.isApiKeyRequest(context, request)) return true;

      // If request is coming from admin
      if (this.isAdminRequest(context, request.user)) return true;

      // If request is coming from user not connecting wallet
      if (this.isNormalRequest(context, request.user)) return true;

      // If request is coming from user connecting wallet
      if (this.isWalletRequest(context, request.wallet)) return true;

      if (
        request.body?.organizationId &&
        request.params.organizationId &&
        request.body.organizationId !== request.params.organizationId
      ) {
        throw new BadRequestException(ERROR_MESSAGES.ORGANIZATION_INVALID_ID);
      }

      const organizationId =
        request.params?.organizationId ?? request.body?.organizationId;

      if (organizationId && request.user) {
        // if request is coming from organization founder
        const isValidOrganizationRequest = await this.isOrganizationRequest(
          context,
          request.user,
          organizationId
        );

        if (isValidOrganizationRequest) return true;

        const isValidPortfolioRequest = await this.isPortfolioRequest(
          context,
          request.user,
          organizationId
        );
        if (isValidPortfolioRequest) return true;
      }

      throw new UnauthorizedException();
    } catch (error) {
      console.error('Auth Guard: ', error);
      throw new UnauthorizedException();
    }
  }

  isPublicRequest(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.PUBLIC,
      [context.getHandler(), context.getClass()]
    );

    return isPublic;
  }

  isAdminRequest(context: ExecutionContext, user: User): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.ADMIN,
      [context.getHandler(), context.getClass()]
    );
    return isAdmin && user.isAdmin;
  }

  isApiKeyRequest(context: ExecutionContext, request): boolean {
    const isAuthorized = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.API_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (
      request.method !== 'GET' &&
      request.organizationId !== request.body.organizationId
    ) {
      return false;
    }

    return isAuthorized && Boolean(request.organizationId);
  }

  isNormalRequest(context: ExecutionContext, user?: User): boolean {
    const isAuthorized = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.NORMAL,
      [context.getHandler(), context.getClass()]
    );

    return isAuthorized && Boolean(user);
  }

  isWalletRequest(context: ExecutionContext, wallet?: Wallet): boolean {
    const isWalletConnected = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.WALLET,
      [context.getHandler(), context.getClass()]
    );
    return isWalletConnected && Boolean(wallet);
  }

  isOrganizationFounderRequest(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.ORGANIZATION_FOUNDER,
      [context.getHandler(), context.getClass()]
    );
  }

  isOrganizationMemberRequest(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.ORGANIZATION_MEMBER,
      [context.getHandler(), context.getClass()]
    );
  }

  isOrganizationRecipientRequest(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.ORGANIZATION_MEMBER,
      [context.getHandler(), context.getClass()]
    );
  }

  isPortfolioAdminRequest(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.PORTFOLIO_ADMIN,
      [context.getHandler(), context.getClass()]
    );
  }

  async isOrganizationRequest(
    context: ExecutionContext,
    user: User,
    organizationId: string
  ): Promise<boolean> {
    const userRole = await this.user.getUserRole(user.id, organizationId);

    if (!userRole) return false;
    if (this.isOrganizationFounderRequest(context)) {
      return userRole.role === Role.FOUNDER;
    }

    if (this.isOrganizationMemberRequest(context)) {
      const roles: Role[] = [Role.FOUNDER, Role.MANAGER, Role.OPERATOR];
      return roles.includes(userRole.role);
    }

    if (this.isOrganizationRecipientRequest(context)) {
      const roles: Role[] = [
        Role.FOUNDER,
        Role.MANAGER,
        Role.OPERATOR,
        Role.ADVISOR,
        Role.INVESTOR,
        Role.EMPLOYEE,
      ];
      return roles.includes(userRole.role);
    }

    return false;
  }

  async isPortfolioRequest(
    context: ExecutionContext,
    user: User,
    organizationId: string
  ): Promise<boolean> {
    if (!this.isPortfolioAdminRequest(context)) return false;

    const userPermission = await this.user.getUserPermission(
      user.id,
      organizationId
    );
    if (!userPermission || userPermission.permission !== Permission.ADMIN)
      return false;
    return true;
  }
}
