import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProcessDepositRefundDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}