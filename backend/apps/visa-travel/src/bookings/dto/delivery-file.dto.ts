import { IsNotEmpty, IsString } from 'class-validator';

export class DeliveryFileDto {
  @IsString()
  @IsNotEmpty()
  deliveryFileKey: string;
}

