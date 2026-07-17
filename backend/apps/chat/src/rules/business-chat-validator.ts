import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BusinessChatValidator {

  async validateBusinessStatus(businessId: string, token: string): Promise<boolean> {
    return true;
  }
}
