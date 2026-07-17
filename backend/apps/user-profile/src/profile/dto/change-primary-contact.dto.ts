import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ChangePrimaryContactDto {
  @IsNotEmpty()
  @IsUUID()
  contactId: string;
}
