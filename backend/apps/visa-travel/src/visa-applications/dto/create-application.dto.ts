import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  agencyId?: string;

  @IsString()
  @IsNotEmpty()
  passportNo: string;

  @IsOptional()
  @IsDateString()
  passportExpiry?: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  visaType: string;

  @IsOptional()
  @IsString()
  travelClass?: string;

  @IsOptional()
  @IsString()
  visaStatus?: string;

  @IsOptional()
  @IsString()
  visaNumber?: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  currentAddress?: {
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    address?: string;
  };

  @IsOptional()
  destinationAddress?: {
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    address?: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  passengers?: string[];

  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  referenceName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  callEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  fileEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  voiceEnabled?: boolean;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

