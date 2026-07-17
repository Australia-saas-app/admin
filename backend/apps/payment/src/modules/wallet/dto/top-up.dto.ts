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

export enum PaymentGateway {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

export class TopUpDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(PaymentGateway)
  @IsNotEmpty()
  paymentMethod: PaymentGateway;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  cardId?: number;

  @IsString()
  @IsOptional()
  paymentIntentId?: string; // For Stripe

  @IsString()
  @IsOptional()
  paypalOrderId?: string; // For PayPal

  @IsString()
  @IsOptional()
  description?: string;
}

