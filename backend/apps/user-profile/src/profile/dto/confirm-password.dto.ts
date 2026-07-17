import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}