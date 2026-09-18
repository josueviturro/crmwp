import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TeamModule } from './team/team.module.js';
import { ContactsModule } from './contacts/contacts.module.js';

@Module({
  imports: [PrismaModule, AuthModule, TeamModule, ContactsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}