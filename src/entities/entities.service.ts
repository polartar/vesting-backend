import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateEntityInput } from './dto/entity.input';

@Injectable()
export class EntitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEntityInput) {
    const entity = await this.prisma.entity.create({ data });
    return entity;
  }
}
