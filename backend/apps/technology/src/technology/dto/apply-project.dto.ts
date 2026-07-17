import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentType } from '../enums/payment-type.enum';

export class ApplyProjectDto {
  @IsString()
  @IsNotEmpty()
  proposal: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  timeline: string;

  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentType: PaymentType;
}
