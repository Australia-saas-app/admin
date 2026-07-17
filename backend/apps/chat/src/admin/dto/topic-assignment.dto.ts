import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTopicToSubAdminDto {
  @ApiProperty({ description: 'Topic name' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ description: 'Array of sub-admin IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  subAdminIds: string[];
}

