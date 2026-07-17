import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Matches,
  Length,
} from 'class-validator';
import { CardType } from '../../../entities/payment-card.entity';

export class AddCardDto {
  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @IsString()
  @IsNotEmpty()
  @Length(13, 19)
  cardNumber: string; // Will be encrypted/processed

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: 'Expiry month must be between 01 and 12',
  })
  expiryMonth: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  expiryYear: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  cvv: string;

  @IsEnum(CardType)
  cardType: CardType;

  @IsString()
  @IsOptional()
  billingAddress?: string;

  @IsString()
  @IsOptional()
  billingCity?: string;

  @IsString()
  @IsOptional()
  billingState?: string;

  @IsString()
  @IsOptional()
  billingZipCode?: string;

  @IsString()
  @IsOptional()
  billingCountry?: string;

  @IsOptional()
  isDefault?: boolean;
}

