import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class ProcessAffiliatePayoutDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsIn(['bank', 'wallet'])
  paymentMethod: string;
}