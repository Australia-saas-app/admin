import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({ description: 'Currency code (ISO 4217)', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Currency name', example: 'US Dollar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Currency symbol', example: '$' })
  @IsString()
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({ description: 'Locale for formatting', example: 'en-US' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional({ description: 'Number of decimal places', example: 2 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(8)
  decimalPlaces?: number;

  @ApiPropertyOptional({ description: 'Exchange rate relative to base currency', example: 1 })
  @IsNumber()
  @IsOptional()
  exchangeRateToBase?: number;

  @ApiPropertyOptional({ description: 'Is this the base currency?', default: false })
  @IsBoolean()
  @IsOptional()
  isBase?: boolean;

  @ApiPropertyOptional({ description: 'Is this currency active?', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is this a cryptocurrency?', default: false })
  @IsBoolean()
  @IsOptional()
  isCrypto?: boolean;

  @ApiPropertyOptional({ description: 'Currency description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Symbol position', enum: ['left', 'right'], default: 'left' })
  @IsString()
  @IsOptional()
  symbolPosition?: string;

  @ApiPropertyOptional({ description: 'Thousand separator', default: ',' })
  @IsString()
  @IsOptional()
  thousandSeparator?: string;

  @ApiPropertyOptional({ description: 'Decimal separator', default: '.' })
  @IsString()
  @IsOptional()
  decimalSeparator?: string;
}
