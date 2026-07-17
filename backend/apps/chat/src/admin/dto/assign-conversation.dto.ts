import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignConversationDto {
  @ApiProperty({ description: 'Admin ID to assign conversation to' })
  @IsString()
  @IsNotEmpty()
  adminId: string;
}

export class ForwardConversationDto {
  @ApiProperty({ description: 'Admin ID to forward conversation to' })
  @IsString()
  @IsNotEmpty()
  targetAdminId: string;
}

export class BlockUserDto {
  @ApiPropertyOptional({ description: 'Reason for blocking' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class ToggleFeatureDto {
  @ApiProperty({ description: 'Enable or disable feature', type: Boolean })
  @IsBoolean()
  enabled: boolean;
}



