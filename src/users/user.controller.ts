import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { NormalAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly user: UsersService) {}

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    try {
      const user = await this.user.getUser(userId);
      return user;
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.USER_GET);
    }
  }

  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/')
  async updateUser(
    @Request() req: { user: User },
    @Body() body: UpdateUserInput
  ) {
    try {
      const user = await this.user.updateUser(req.user.id, body);
      return user;
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.USER_UPDATE);
    }
  }
}
