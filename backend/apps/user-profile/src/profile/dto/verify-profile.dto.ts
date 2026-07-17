import {
  IsString,
  IsEnum,
  IsUrl,
  IsDateString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { IdentityType } from '../entities/user-profile.entity';

export class VerifyProfileDto {
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(500)
  profilePhoto: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nationality: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  identityNumber: string;

  @IsNotEmpty()
  @IsEnum(IdentityType)
  identityType: IdentityType;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(500)
  documentUrl: string;
}
