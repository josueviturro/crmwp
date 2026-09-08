import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Role } from '../generated/prisma/client.js';
import { InviteMemberDto } from './dto/invite-member.dto.js';

const memberSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  listMembers(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: memberSelect,
      orderBy: { createdAt: 'asc' },
    });
  }

  async inviteMember(tenantId: string, dto: InviteMemberDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Ese email ya está registrado');
    }

    const temporaryPassword = randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role,
        password: hashedPassword,
        tenantId,
      },
      select: memberSelect,
    });

    return { user, temporaryPassword };
  }

  async updateRole(tenantId: string, userId: string, role: Role) {
    await this.findMemberOrThrow(tenantId, userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: memberSelect,
    });
  }

  async removeMember(tenantId: string, userId: string, requesterId: string) {
    if (userId === requesterId) {
      throw new BadRequestException('No podés eliminarte a vos mismo del equipo');
    }
    await this.findMemberOrThrow(tenantId, userId);

    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true };
  }

  private async findMemberOrThrow(tenantId: string, userId: string) {
    const member = await this.prisma.user.findFirst({ where: { id: userId, tenantId } });
    if (!member) {
      throw new NotFoundException('Ese usuario no pertenece a tu equipo');
    }
    return member;
  }
}
