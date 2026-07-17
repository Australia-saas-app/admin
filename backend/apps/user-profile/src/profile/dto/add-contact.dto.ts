import {
  IsString,
  IsEnum,
  IsEmail,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ContactType } from '../entities/user-contact.entity';

export class AddContactDto {
  @IsNotEmpty()
  @IsEnum(ContactType)
  type: ContactType;

  @IsNotEmpty()
  @IsString()
  value: string; // email or phone number

  @IsNotEmpty()
  @IsString()
  otp: string; // OTP for verification
}
