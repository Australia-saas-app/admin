import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class OrderClientService {
  private readonly logger = new Logger(OrderClientService.name);
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('ORDER_SERVICE_URL', 'http://backend-main-order-service:3003/api/orders');
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
    });
  }

  async getOrderStatus(orderId: string, token: string): Promise<string | null> {
    try {
      const response = await this.client.get(`/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.status || null;
    } catch (error) {
      this.logger.error(`Failed to get order status: ${error.message}`);
      return null;
    }
  }

  async validateOrderForChat(orderId: string, token: string): Promise<boolean> {
    const status = await this.getOrderStatus(orderId, token);
    return status === 'pending' || status === 'working';
  }

  async getChatEnabledOrders(token: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await this.client.get('/chat-enabled', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get chat-enabled orders: ${error.message}`);
      return { orders: [], total: 0 };
    }
  }
}

