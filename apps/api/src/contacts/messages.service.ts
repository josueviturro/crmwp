import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessageDirection, MessageType } from '../generated/prisma/client.js';
import { CreateMessageDto } from './dto/create-message.dto.js';

const messageInclude = {
  sentBy: { select: { id: true, name: true } },
} as const;

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async list(tenantId: string, contactId: string) {
    await this.verifyContact(tenantId, contactId);
    return this.prisma.message.findMany({
      where: { contactId },
      include: messageInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(tenantId: string, contactId: string, userId: string, dto: CreateMessageDto) {
    await this.verifyContact(tenantId, contactId);
    const direction = dto.direction ?? MessageDirection.OUTBOUND;
    return this.prisma.message.create({
      data: {
        type: dto.type ?? MessageType.TEXT,
        text: dto.text,
        mediaUrl: dto.mediaUrl,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng,
        locationName: dto.locationName,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        direction,
        contactId,
        tenantId,
        sentById: direction === MessageDirection.OUTBOUND ? userId : undefined,
      },
      include: messageInclude,
    });
  }

  private async verifyContact(tenantId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({ where: { id: contactId, tenantId } });
    if (!contact) {
      throw new NotFoundException('Ese contacto no existe en tu negocio');
    }
    return contact;
  }
}
