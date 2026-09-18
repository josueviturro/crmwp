import { IsString, MinLength } from 'class-validator';

export class UpdateStageDto {
  @IsString()
  @MinLength(1)
  name: string;
}
