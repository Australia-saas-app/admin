import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';

export class PaySecurityDepositDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsIn(['stripe', 'paypal'])
  paymentMethod: string;
}