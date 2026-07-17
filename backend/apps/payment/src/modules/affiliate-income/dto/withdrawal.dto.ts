import { IsNotEmpty, IsNumber, IsString, IsObject } from 'class-validator';

export class AffiliateWithdrawalDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsObject()
  @IsNotEmpty()
  bankDetails: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };

  @IsString()
  @IsNotEmpty()
  currency: string;
}