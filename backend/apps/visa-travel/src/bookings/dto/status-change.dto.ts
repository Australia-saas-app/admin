import { IsIn, IsOptional, IsString } from 'class-validator';
import { BOOKING_STATUSES } from '../../common/status.constants';

export class BookingStatusChangeDto {
  @IsString()
  @IsIn(BOOKING_STATUSES as unknown as string[])
  toStatus: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  actorId?: string;
}

