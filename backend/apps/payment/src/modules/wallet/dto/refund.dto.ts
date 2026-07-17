import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RefundDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string; // Original transaction to refund

  @IsNumber()
  @IsOptional()
  @Min(0.01, { message: 'Refund amount must be greater than 0' })
  @Type(() => Number)
  amount?: number; // Optional: if not provided, refund full amount

  @IsString()
  @IsOptional()
  reason?: string;
}

