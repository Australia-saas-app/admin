import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export enum AnalyticsPeriod {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export enum AnalyticsGroupBy {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class AnalyticsQueryDto {
  @IsEnum(AnalyticsPeriod)
  @IsOptional()
  period?: AnalyticsPeriod;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(AnalyticsGroupBy)
  @IsOptional()
  groupBy?: AnalyticsGroupBy;
}

