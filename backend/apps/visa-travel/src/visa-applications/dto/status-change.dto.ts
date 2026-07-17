import { IsIn, IsOptional, IsString } from 'class-validator';
import { APPLICATION_STATUSES } from '../../common/status.constants';

export class StatusChangeDto {
  @IsString()
  @IsIn(APPLICATION_STATUSES as unknown as string[])
  toStatus: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  actorId?: string;
}

