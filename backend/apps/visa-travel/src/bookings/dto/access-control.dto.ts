import { IsBoolean, IsOptional } from 'class-validator';

export class AccessControlDto {
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
}

