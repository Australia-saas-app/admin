import { IsNumber, Min } from 'class-validator';

export class AddProfitDto {
  @IsNumber()
  @Min(0)
  profitAmount: number;
}


