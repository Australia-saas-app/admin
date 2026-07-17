import { IsNumber, Min } from 'class-validator';

export class PaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;
}

