import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}

