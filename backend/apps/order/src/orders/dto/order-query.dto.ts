import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AccountType, OrderStatus, OrderType } from '../entities/order.entity';

export class OrderQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  orderType?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeAnalytics?: boolean;
}

export class AdminOrderQueryDto extends OrderQueryDto {
  @IsOptional()
  @IsEnum(AccountType)
  createdByType?: AccountType;

  @IsOptional()
  @IsEnum(OrderStatus)
  statusEquals?: OrderStatus;

  @IsOptional()
  @IsEnum(OrderType)
  typeEquals?: OrderType;
}

