import { IsNumber, Min } from 'class-validator';

export class ProfitDto {
  @IsNumber()
  @Min(0)
  amount: number;
}

