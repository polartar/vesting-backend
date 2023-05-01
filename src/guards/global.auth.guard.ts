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

    if (this.isAdminRequest(context, request.user)) return true;

    if (this.isPublicRequest(context)) return true;

    if (this.isNormalRequest(context, request.user)) return true;

    if (this.isWalletRequest(context, request.wallet)) return true;

    if (
      request.body?.organizationId &&
      request.params.organizationId &&
      request.body.organizationId !== request.params.organizationId
    ) {
      throw new BadRequestException('Wrong organizationId');
    }

    const organizationId =
      request.params?.organizationId ?? request.body?.organizationId;
    const isOrganizationFounder = await this.isOrganizationFounderRequest(
      context,
      request.user,
      organizationId
    );

    if (isOrganizationFounder) return true;

    const isOrganizationMember = await this.isOrganizationMemberRequest(
      context,
      request.user,
      organizationId
    );

    if (isOrganizationMember) return true;

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

      await this.validateOrganizationRequest(user.id, organizationId, [
        Role.MEMBER_FOUNDER,
      ]);
    }

    return true;
  }

  async isOrganizationMemberRequest(
    context: ExecutionContext,
    user: User,
    organizationId: string
  ): Promise<boolean> {
    const isOrganizationMember = this.reflector.getAllAndOverride<boolean>(
      GlobalAuthGuardKeys.ORGANIZATION_MEMBER,
      [context.getHandler(), context.getClass()]
    );

    if (isOrganizationMember) {
      if (!organizationId)
        throw new BadRequestException(ERROR_MESSAGES.ORGANIZATION_ID_MISSING);

      await this.validateOrganizationRequest(user.id, organizationId, [
        Role.MEMBER_FOUNDER,
        Role.MEMBER_MANAGER,
        Role.MEMBER_EMPLOYEE,
      ]);
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

  async validateOrganizationRequest(
    userId: string,
    organizationId: string,
    roles: Role[]
  ) {
    const userRole = await this.user.getUserRole(userId, organizationId);
    if (!roles.includes(userRole.role)) {
      throw new UnauthorizedException();
    }
  }
}
