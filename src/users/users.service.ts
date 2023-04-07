import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
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
}
