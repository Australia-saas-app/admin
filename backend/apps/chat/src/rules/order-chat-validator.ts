import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderClientService } from 'src/integration/order-client.service';

@Injectable()
export class OrderChatValidator {
  constructor(private readonly orderClientService: OrderClientService) {}

  async validateOrderStatus(orderId: string, token: string): Promise<boolean> {
    const isValid = await this.orderClientService.validateOrderForChat(orderId, token);
    
    if (!isValid) {
      throw new BadRequestException(
        'Order chat is only available when order status is "Pending" or "Working"'
      );
    }

    return true;
  }
}

