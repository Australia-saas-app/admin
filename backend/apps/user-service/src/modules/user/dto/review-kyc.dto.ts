import { IsEnum, IsString, IsOptional } from 'class-validator';
import { KycStatus } from '../../../entities/user.entity';

export class ReviewKycDto {
  @IsEnum(KycStatus)
  status: KycStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}