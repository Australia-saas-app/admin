import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quantity?: number = 1;

  @ApiProperty()
  @IsNumber()
  unitAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class CreateCheckoutSessionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  @IsArray()
  items: CheckoutItemDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  successUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cancelUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gateway?: 'stripe' | 'paypal' = 'stripe';
}

export class CheckoutSessionResponseDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  checkoutUrl: string;

  @ApiProperty()
  gateway: 'stripe' | 'paypal';

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  expiresAt: Date;
}