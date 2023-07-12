import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUserIfNotExists(email: string, name: string) {
    let user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (user) return user;

    user = await this.prisma.user.create({
      data: { email, name },
    });
    return user;
  }

  getUser(userId: string, { withEmail = false } = {}) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: withEmail,
        isAdmin: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        firebaseId: true,
      },
    });
  }

  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  getUserRole(userId: string, organizationId: string) {
    return this.prisma.userRole.findFirst({
      where: {
        userId,
        organizationId,
      },
    });
  }

  getUserPermission(userId: string, organizationId: string) {
    return this.prisma.userPermission.findFirst({
      where: {
        userId,
        organizationId,
      },
    });
  }
}
