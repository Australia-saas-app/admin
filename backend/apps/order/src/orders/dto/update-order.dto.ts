import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDto, OrderDetailsDto } from './create-order.dto';
import { OrderAccess } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDetailsDto)
  orderDetails?: OrderDetailsDto;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  assignedToId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  assignedToName?: string;

  @IsOptional()
  @IsEnum(OrderAccess)
  access?: OrderAccess;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;
}


