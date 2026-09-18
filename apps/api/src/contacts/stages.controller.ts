import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/current-user.decorator.js';
import { StagesService } from './stages.service.js';
import { CreateStageDto } from './dto/create-stage.dto.js';
import { UpdateStageDto } from './dto/update-stage.dto.js';
import { ReorderStagesDto } from './dto/reorder-stages.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('stages')
export class StagesController {
  constructor(private stagesService: StagesService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.stagesService.list(user.tenantId);
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStageDto) {
    return this.stagesService.create(user.tenantId, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('reorder')
  reorder(@CurrentUser() user: AuthenticatedUser, @Body() dto: ReorderStagesDto) {
    return this.stagesService.reorder(user.tenantId, dto);
  }

  @UseGuards(AdminGuard)
  @Patch(':stageId')
  update(@CurrentUser() user: AuthenticatedUser, @Param('stageId') stageId: string, @Body() dto: UpdateStageDto) {
    return this.stagesService.update(user.tenantId, stageId, dto);
  }

  @UseGuards(AdminGuard)
  @Delete(':stageId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('stageId') stageId: string) {
    return this.stagesService.remove(user.tenantId, stageId);
  }
}
