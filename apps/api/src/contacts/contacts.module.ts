import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { StagesController } from './stages.controller.js';
import { StagesService } from './stages.service.js';
import { ContactsController } from './contacts.controller.js';
import { ContactsService } from './contacts.service.js';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';

@Module({
  imports: [AuthModule],
  controllers: [StagesController, ContactsController, MessagesController],
  providers: [StagesService, ContactsService, MessagesService],
})
export class ContactsModule {}
