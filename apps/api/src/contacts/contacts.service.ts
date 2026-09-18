import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

const contactInclude = {
  assignedTo: { select: { id: true, name: true } },
  stage: { select: { id: true, name: true } },
  messages: { orderBy: { createdAt: 'desc' as const }, take: 1 },
} as const;

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  list(tenantId: string) {
    return this.prisma.contact.findMany({
      where: { tenantId },
      include: contactInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreateContactDto) {
    await this.verifyStageBelongsToTenant(tenantId, dto.stageId);
    return this.prisma.contact.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        company: dto.company,
        notes: dto.notes,
        stageId: dto.stageId,
        assignedToId: dto.assignedToId,
        tenantId,
      },
      include: contactInclude,
    });
  }

  async update(tenantId: string, contactId: string, dto: UpdateContactDto) {
    await this.findContactOrThrow(tenantId, contactId);
    if (dto.stageId) {
      await this.verifyStageBelongsToTenant(tenantId, dto.stageId);
    }
    return this.prisma.contact.update({
      where: { id: contactId },
      data: dto,
      include: contactInclude,
    });
  }

  async remove(tenantId: string, contactId: string) {
    await this.findContactOrThrow(tenantId, contactId);
    await this.prisma.contact.delete({ where: { id: contactId } });
    return { success: true };
  }

  private async findContactOrThrow(tenantId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({ where: { id: contactId, tenantId } });
    if (!contact) {
      throw new NotFoundException('Ese contacto no existe en tu negocio');
    }
    return contact;
  }

  private async verifyStageBelongsToTenant(tenantId: string, stageId: string) {
    const stage = await this.prisma.stage.findFirst({ where: { id: stageId, tenantId } });
    if (!stage) {
      throw new NotFoundException('Esa etapa no existe en tu negocio');
    }
  }
}
