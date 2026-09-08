import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Ese email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const tenant = await this.prisma.tenant.create({
      data: { name: dto.businessName },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        tenantId: tenant.id,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, tenantId: true },
    });
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe');
    }
    return user;
  }

  private buildAuthResponse(user: { id: string; email: string; name: string; tenantId: string }) {
    const token = this.jwtService.sign({ sub: user.id, tenantId: user.tenantId });
    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
