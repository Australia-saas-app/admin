import {
  IsString,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { IdentityType } from '../../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class SubmitKycDto {
  @ApiProperty({ description: 'Full name as per identity document' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ description: 'Photo file (jpg, png)', required: false })
  photo?: Express.Multer.File;

  @ApiProperty({ description: 'Government ID document file (jpg, png, pdf)', required: false })
  governmentId?: Express.Multer.File;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gender?: string;

  @ApiProperty({ description: 'Date of birth in YYYY-MM-DD format' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ description: 'Nationality country code' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nationality: string;

  @ApiProperty({ enum: IdentityType, description: 'Type of identity document' })
  @IsNotEmpty()
  @IsEnum(IdentityType)
  identityType: IdentityType;

  @ApiProperty({ description: 'Identity document number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  identityNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  passportNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  permanentAddress?: string;
}