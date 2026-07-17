import { IsOptional, IsBoolean, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetExchangeRatesDto {
  @ApiPropertyOptional({ description: 'From currency code' })
  @IsString()
  @IsOptional()
  fromCurrencyCode?: string;

  @ApiPropertyOptional({ description: 'To currency code' })
  @IsString()
  @IsOptional()
  toCurrencyCode?: string;

  @ApiPropertyOptional({ description: 'Filter active rates only' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 20;
}
