import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitRatingDto {
  @ApiPropertyOptional({ enum: ['yes', 'no'] })
  @IsEnum(['yes', 'no'])
  rating: 'yes' | 'no';
}

export class SetExpirationDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expirationDate?: string;
}

