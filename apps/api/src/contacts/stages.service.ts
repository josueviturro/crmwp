import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStageDto } from './dto/create-stage.dto.js';
import { UpdateStageDto } from './dto/update-stage.dto.js';
import { ReorderStagesDto } from './dto/reorder-stages.dto.js';

@Injectable()
export class StagesService {
  constructor(private prisma: PrismaService) {}

  list(tenantId: string) {
    return this.prisma.stage.findMany({
      where: { tenantId },
      orderBy: { order: 'asc' },
    });
  }

  async create(tenantId: string, dto: CreateStageDto) {
    const last = await this.prisma.stage.findFirst({
      where: { tenantId },
      orderBy: { order: 'desc' },
    });
    return this.prisma.stage.create({
      data: {
        name: dto.name,
        order: last ? last.order + 1 : 0,
        tenantId,
      },
    });
  }

  async update(tenantId: string, stageId: string, dto: UpdateStageDto) {
    await this.findStageOrThrow(tenantId, stageId);
    return this.prisma.stage.update({
      where: { id: stageId },
      data: { name: dto.name },
    });
  }

  async remove(tenantId: string, stageId: string) {
    await this.findStageOrThrow(tenantId, stageId);
    const contactsInStage = await this.prisma.contact.count({ where: { stageId } });
    if (contactsInStage > 0) {
      throw new BadRequestException('No podés borrar una etapa que todavía tiene contactos. Moveelos primero.');
    }
    await this.prisma.stage.delete({ where: { id: stageId } });
    return { success: true };
  }

  async reorder(tenantId: string, dto: ReorderStagesDto) {
    const stages = await this.prisma.stage.findMany({ where: { tenantId } });
    const stageIds = new Set(stages.map((s) => s.id));
    const allBelongToTenant = dto.orderedIds.every((id) => stageIds.has(id));
    if (!allBelongToTenant || dto.orderedIds.length !== stages.length) {
      throw new BadRequestException('La lista de etapas no coincide con las de tu negocio');
    }

    await this.prisma.$transaction(
      dto.orderedIds.map((id, index) => this.prisma.stage.update({ where: { id }, data: { order: index } })),
    );
    return this.list(tenantId);
  }

  private async findStageOrThrow(tenantId: string, stageId: string) {
    const stage = await this.prisma.stage.findFirst({ where: { id: stageId, tenantId } });
    if (!stage) {
      throw new NotFoundException('Esa etapa no existe en tu negocio');
    }
    return stage;
  }
}
