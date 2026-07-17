import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConvertCurrencyDto {
  @ApiProperty({ description: 'Source currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({ description: 'Target currency code', example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  toCurrency: string;

  @ApiProperty({ description: 'Amount to convert', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ description: 'Service name for tracking', example: 'payment' })
  @IsString()
  @IsOptional()
  serviceName?: string;

  @ApiPropertyOptional({ description: 'Reference ID for tracking' })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiPropertyOptional({ description: 'Reference type for tracking' })
  @IsString()
  @IsOptional()
  referenceType?: string;
}
