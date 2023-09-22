import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  Inject,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CreateEntityInput, QueryEntityInput } from './dto/entity.input';
import { Entity } from '@prisma/client';
import { IEntityQuery } from './dto/interfaces';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class EntitiesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  async create(data: CreateEntityInput) {
    const entity = await this.prisma.entity.create({ data });
    return entity;
  }

  async getAll(query: QueryEntityInput) {
    const organizationId =
      query.organizationId || (this.request as any).organizationId;
    if (!organizationId) {
      throw new BadRequestException("OrganizationId can't be empty");
    }
    const where: Partial<Entity> = {
      organizationId: organizationId,
    };

    return this.prisma.entity.findMany({ where });
  }

  async count(query: IEntityQuery) {
    return this.prisma.entity.count({ where: query });
  }
}
