import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeAccountOwnerDto {
  @IsString()
  @IsNotEmpty()
  emailOrPhone: string;
}

