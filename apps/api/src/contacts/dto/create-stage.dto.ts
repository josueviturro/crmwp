import { IsString, MinLength } from 'class-validator';

export class CreateStageDto {
  @IsString()
  @MinLength(1)
  name: string;
}
