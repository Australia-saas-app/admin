import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AgencyStatus } from './agency-query.dto';

export class UpdateAgencyStatusDto {
  @IsEnum(AgencyStatus)
  status: AgencyStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}

