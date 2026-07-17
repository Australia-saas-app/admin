import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteContactDto {
  @IsNotEmpty()
  @IsString()
  password: string; // Required for security
}
