import { IsString, IsNumber } from 'class-validator';

export class ReorderServiceDto {
  @IsString()
  serviceId: string;

  @IsNumber()
  newPosition: number;
}

