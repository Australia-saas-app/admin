import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CommissionRateDto {
  @IsString()
  @IsNotEmpty()
  businessType: string;

  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class SetCommissionRatesDto {
  @IsNotEmpty()
  @Type(() => CommissionRateDto)
  rates: CommissionRateDto[];
}