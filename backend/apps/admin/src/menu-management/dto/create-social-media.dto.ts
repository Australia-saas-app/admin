import { IsString } from 'class-validator';

export class CreateSocialMediaDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  icon: string;
}

