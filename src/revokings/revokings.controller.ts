import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Query,
  Param,
  Put,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiKeyAuth,
  OrganizationFounderAuth,
  PublicAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { RevokingsService } from './revokings.service';
import {
  CreateRevokingInput,
  QueryRevokingsInput,
  UpdateRevokingInput,
} from './dto/revoking.input';
import { RecipesService } from 'src/recipe/recipes.service';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { Revoking } from '@prisma/client';
import { IRevokingsQuery } from './dto/interface';

@Controller('revoking')
export class RevokingsController {
  constructor(
    private readonly revoking: RevokingsService,
    private readonly recipe: RecipesService
  ) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createRevoking(@Body() body: CreateRevokingInput) {
    const recipe = await this.recipe.getByQuery({
      organizationId: body.organizationId,
      id: body.recipeId,
    });
    if (!recipe) {
      throw new NotFoundException(ERROR_MESSAGES.RECIPIENT_NOT_FOUND);
    }

    return this.revoking.create({
      organizationId: body.organizationId,
      recipeId: body.recipeId,
      vestingId: recipe.vestingId,
      chainId: body.chainId,
    });
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:revokingId')
  async updateRevoking(
    @Body() body: UpdateRevokingInput,
    @Param('revokingId') revokingId: string
  ) {
    const revoking = await this.revoking.get({
      organizationId: body.organizationId,
      id: revokingId,
    });
    if (!revoking) {
      throw new NotFoundException(ERROR_MESSAGES.REVOKING_NOT_FOUND);
    }

    return this.revoking.update(revokingId, body);
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @ApiKeyAuth()
  @Get('/list')
  async getRevokings(
    @Query() query: QueryRevokingsInput,
    @Request() req: { organizationId: string }
  ) {
    const where: IRevokingsQuery = {};

    const organizationId = query.organizationId || req.organizationId;
    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (query.vestingId) {
      where.vestingId = query.vestingId;
    }

    if (query.recipeId) {
      where.recipeId = query.recipeId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.chainId) {
      where.chainId = +query.chainId;
    }

    if (query.recipient) {
      where.recipe = {
        address: {
          contains: query.recipient,
          mode: 'insensitive',
        },
      };
    }

    return this.revoking.getAll(where);
  }
}
