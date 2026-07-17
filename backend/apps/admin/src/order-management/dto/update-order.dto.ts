import { IsOptional, IsString, IsNumber, IsEnum, IsArray, IsObject, IsBoolean } from 'class-validator';
import { OrderStatus } from './order-query.dto';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  serviceName?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsObject()
  pricing?: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  access?: string;

  @IsOptional()
  @IsObject()
  orderDetails?: Record<string, any>;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsString()
  assignedToName?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;
}

