import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { MessageDirection } from '../../generated/prisma/client.js';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  text: string;

  @IsOptional()
  @IsEnum(MessageDirection)
  direction?: MessageDirection;
}
