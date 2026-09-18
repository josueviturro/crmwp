import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { StagesController } from './stages.controller.js';
import { StagesService } from './stages.service.js';
import { ContactsController } from './contacts.controller.js';
import { ContactsService } from './contacts.service.js';

@Module({
  imports: [AuthModule],
  controllers: [StagesController, ContactsController],
  providers: [StagesService, ContactsService],
})
export class ContactsModule {}
