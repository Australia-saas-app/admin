import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  Min,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentGateway } from './top-up.dto';

export class OrderPaymentDto {
  @IsNumber()
  @IsOptional()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount?: number; // If not provided, pays full due amount

  @IsString()
  @IsOptional()
  description?: string;
}

export class OrderPaymentCardDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  cardId?: number;

  @IsEnum(PaymentGateway)
  @IsNotEmpty()
  paymentMethod: PaymentGateway;

  @IsString()
  @IsOptional()
  paymentIntentId?: string; // For Stripe

  @IsString()
  @IsOptional()
  paypalOrderId?: string; // For PayPal
}

