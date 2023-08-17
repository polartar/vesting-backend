import { Controller, UseGuards, Body, Post, Get, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioAdminAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { EntitiesService } from './entities.service';
import { CreateEntityInput, QueryEntityInput } from './dto/entity.input';

@Controller('entity')
export class EntitiesController {
  constructor(private readonly entity: EntitiesService) {}

  @ApiBearerAuth()
  @PortfolioAdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createEntity(@Body() body: CreateEntityInput) {
    const entity = await this.entity.create(body);
    return entity;
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/list')
  async getEntities(@Query() query: QueryEntityInput) {
    const entities = await this.entity.get(query);
    return entities;
  }
}
