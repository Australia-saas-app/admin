import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  Min,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum WithdrawalMethod {
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE_CONNECT = 'stripe_connect',
}

export class AccountDetailsDto {
  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  routingNumber?: string;

  @IsString()
  @IsOptional()
  accountHolderName?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  paypalEmail?: string;
}

export class WithdrawDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(WithdrawalMethod)
  @IsNotEmpty()
  withdrawalMethod: WithdrawalMethod;

  @IsObject()
  @ValidateNested()
  @Type(() => AccountDetailsDto)
  @IsOptional()
  accountDetails?: AccountDetailsDto;

  @IsString()
  @IsOptional()
  description?: string;
}

