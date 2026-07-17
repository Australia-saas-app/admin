import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT = 'payment',
  WAITING = 'waiting',
  WORKING = 'working',
  STOPPED = 'stopped',
  COMPLETE = 'complete',
  DELIVERY = 'delivery',
  REFUND = 'refund',
  CANCEL = 'cancel',
}

export class OrderQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  agencyId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

