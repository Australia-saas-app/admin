import { IsOptional, IsInt, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class AffiliateReferralsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsIn(['pending', 'active', 'inactive'])
  status?: 'pending' | 'active' | 'inactive';
}