import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SetDepositAmountDto {
  @IsNumber()
  @IsNotEmpty()
  depositAmount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}