import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum ProjectPaymentKind {
  ONE_TIME = 'one_time',
  MILESTONE = 'milestone',
}

export class StripeProjectCheckoutDto {
  @IsString()
  @IsNotEmpty()
  businessUserId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  milestoneId?: string;

  @IsEnum(ProjectPaymentKind)
  @IsOptional()
  paymentKind?: ProjectPaymentKind;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePayPalProjectOrderDto extends StripeProjectCheckoutDto {}

export class CapturePayPalProjectPaymentDto {
  @IsString()
  @IsNotEmpty()
  paypalOrderId: string;
}

export class CompleteStripeProjectPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;
}

