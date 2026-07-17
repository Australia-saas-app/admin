import { IsNumber, Min } from 'class-validator';

export class RefundDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNumber()
  @Min(0)
  fee?: number;
}

