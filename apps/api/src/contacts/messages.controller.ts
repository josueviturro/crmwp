import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/current-user.decorator.js';
import { MessagesService } from './messages.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('contacts/:contactId/messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Param('contactId') contactId: string) {
    return this.messagesService.list(user.tenantId, contactId);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.create(user.tenantId, contactId, user.userId, dto);
  }
}
