import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { AgencyStatus } from './agency-query.dto';

export class UpdateAgencyDto {
  @IsOptional()
  @IsString()
  agencyName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  annualFee?: number;

  @IsOptional()
  @IsNumber()
  securityDeposit?: number;

  @IsOptional()
  @IsEnum(AgencyStatus)
  status?: AgencyStatus;

  @IsOptional()
  @IsBoolean()
  contactInfoPublic?: boolean;
}

