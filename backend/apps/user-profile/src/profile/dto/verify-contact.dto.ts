import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ContactType } from '../entities/user-contact.entity';

export class VerifyContactDto {
  @IsNotEmpty()
  @IsEnum(ContactType)
  type: ContactType;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}