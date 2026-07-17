import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderAccess, OrderType } from '../entities/order.entity';

export class AddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;
}

export class ClientInfoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationality?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  governmentId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  permanentAddress?: AddressDto;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}

export class PricingDto {
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;
}

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  fileType: string;
}

export class OrderDetailsDto {
  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsString()
  priorityLevel?: string;

  @IsOptional()
  @IsDateString()
  expectedEndDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  workplace?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  destinationAddress?: AddressDto;

  @IsOptional()
  @IsString()
  rentalAgreementPeriod?: string;

  @IsOptional()
  @IsDateString()
  contractDate?: string;

  @IsOptional()
  @IsString()
  contractDuration?: string;

  @IsOptional()
  @IsString()
  productModelId?: string;

  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsDateString()
  estimatedArrivalDate?: string;

  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsOptional()
  @IsDateString()
  passportExpiryDate?: string;

  @IsOptional()
  @IsString()
  visaStatus?: string;

  @IsOptional()
  @IsString()
  visaNumber?: string;

  @IsOptional()
  @IsDateString()
  visaExpirationDate?: string;

  @IsOptional()
  @IsString()
  visaType?: string;

  @IsOptional()
  @IsString()
  travelClass?: string;

  @IsOptional()
  @IsNumber()
  passengersNo?: number;

  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  propertyAddress?: AddressDto;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsString()
  propertyStatus?: string;

  @IsOptional()
  @IsString()
  currentStatus?: string;

  @IsOptional()
  @IsNumber()
  sizeSquareFeet?: number;

  @IsOptional()
  @IsNumber()
  beds?: number;

  @IsOptional()
  @IsNumber()
  bathroom?: number;

  @IsOptional()
  @IsNumber()
  kitchen?: number;

  @IsOptional()
  @IsArray()
  features?: string[];
}

export class CreateOrderDto {
  @IsEnum(OrderType)
  orderType: OrderType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  serviceName: string;

  @ValidateNested()
  @Type(() => ClientInfoDto)
  clientInfo: ClientInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDetailsDto)
  orderDetails?: OrderDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  referenceName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(OrderAccess)
  access?: OrderAccess;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  @IsArray()
  @ArrayMaxSize(10)
  documents?: DocumentDto[];
}


