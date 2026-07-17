import { IsNumber, IsString, Min } from 'class-validator';

export class AddPenaltyDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  reason: string;
}

