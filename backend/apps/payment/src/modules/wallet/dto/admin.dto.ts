import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  Min,
  IsEnum,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BalanceAdjustmentType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export class AdminBalanceAdjustmentDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  @IsEnum(BalanceAdjustmentType)
  @IsNotEmpty()
  type: BalanceAdjustmentType;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class AdminWalletQueryDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minBalance?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxBalance?: number;
}

export class AdminTransactionQueryDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxAmount?: number;
}

