import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaymentType } from '../enums/payment-type.enum';

export class ProposalQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  timeline?: string;

  @IsOptional()
  @IsEnum(PaymentType)
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  paymentType?: PaymentType;
}
