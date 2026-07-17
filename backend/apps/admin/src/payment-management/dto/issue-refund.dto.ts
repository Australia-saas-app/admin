import { IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class IssueRefundDto {
  @IsNumber()
  @Min(0)
  totalRefundAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  feesRefundedAmount?: number;

  @IsString()
  reason: string;
}

