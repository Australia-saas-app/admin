import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RequestSecurityDepositRefundDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}