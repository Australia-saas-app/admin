import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExchangeRateDto {
  @ApiProperty({ description: 'From currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  fromCurrencyCode: string;

  @ApiProperty({ description: 'To currency code', example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  toCurrencyCode: string;

  @ApiProperty({ description: 'Exchange rate', example: 0.85 })
  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @ApiPropertyOptional({ description: 'Effective date' })
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({ description: 'Rate source', example: 'manual' })
  @IsString()
  @IsOptional()
  source?: string;
}
