import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateEntityInput, QueryEntityInput } from './dto/entity.input';
import { Entity } from '@prisma/client';
import { IEntityQuery } from './dto/interfaces';

@Injectable()
export class EntitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEntityInput) {
    const entity = await this.prisma.entity.create({ data });
    return entity;
  }

  async getAll(query: QueryEntityInput) {
    const where: Partial<Entity> = {
      organizationId: query.organizationId,
    };

    return this.prisma.entity.findMany({ where });
  }

  async count(query: IEntityQuery) {
    return this.prisma.entity.count({ where: query });
  }
}
