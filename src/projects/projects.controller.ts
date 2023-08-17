import { Controller, UseGuards, Body, Post, Get, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioAdminAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectInput, QueryProjectInput } from './dto/project.input';

@Controller('project')
export class ProjectsController {
  constructor(private readonly project: ProjectsService) {}

  @ApiBearerAuth()
  @PortfolioAdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createProject(@Body() body: CreateProjectInput) {
    const project = await this.project.create(body);
    return project;
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/list')
  async getProjects(@Query() query: QueryProjectInput) {
    const projects = await this.project.getAll(query);
    return projects;
  }
}
