import { IsString, IsNumber } from 'class-validator';

export class ReorderMenuDto {
  @IsString()
  id: string;

  @IsNumber()
  newPosition: number;
}

