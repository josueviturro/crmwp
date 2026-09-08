import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TeamModule } from './team/team.module.js';

@Module({
  imports: [PrismaModule, AuthModule, TeamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}