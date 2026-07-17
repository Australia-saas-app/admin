import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterMessageDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  before?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  after?: string;
}

