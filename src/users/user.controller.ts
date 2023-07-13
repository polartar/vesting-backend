import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Param,
  Request,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { NormalAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { QueryUserInput, UpdateUserInput } from './dto/update-user.input';
import { User } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly user: UsersService) {}

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    const user = await this.user.getUser(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.AUTH_USER_NOT_FOUND);
    }
    return user;
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/get/single')
  async getUserByQuery(@Query() query: QueryUserInput) {
    if (!query || (!query.id && !query.email && !query.address)) {
      throw new BadRequestException(ERROR_MESSAGES.USER_WRONG_QUERY);
    }

    const user = await this.user.getUserByQuery(query);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.AUTH_USER_NOT_FOUND);
    }
    return user;
  }

  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/')
  async updateUser(
    @Request() req: { user: User },
    @Body() body: UpdateUserInput
  ) {
    const user = await this.user.updateUser(req.user.id, body);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.AUTH_USER_NOT_FOUND);
    }
    return user;
  }
}
