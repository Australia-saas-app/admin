import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { OrderQueryDto, OrderStatus } from './dto/order-query.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AddProfitDto } from './dto/add-profit.dto';
import { AddFilesDto } from './dto/add-files.dto';

@Injectable()
export class OrderManagementService {
  private readonly logger = new Logger(OrderManagementService.name);
  private readonly orderServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.orderServiceUrl = this.configService.get<string>(
      'ORDER_SERVICE_URL',
      'http://localhost:3011/api/orders',
    );
  }

  private getHeaders(adminToken?: string) {
    return {
      'Content-Type': 'application/json',
      ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
    };
  }

  async getOrders(query: OrderQueryDto, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.orderServiceUrl}/admin/list`, {
          headers: this.getHeaders(adminToken),
          params: query,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch orders: ${error.message}`);
      throw new BadRequestException('Failed to fetch orders');
    }
  }

  async getOrderDetails(orderCode: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.orderServiceUrl}/admin/${orderCode}`, {
          headers: this.getHeaders(adminToken),
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      this.logger.error(`Failed to fetch order details: ${error.message}`);
      throw new BadRequestException('Failed to fetch order details');
    }
  }

  async updateOrder(
    orderCode: string,
    updateDto: UpdateOrderDto,
    adminToken?: string,
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.orderServiceUrl}/admin/${orderCode}`,
          updateDto,
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      const orderServiceError = error.response?.data?.message || error.message;
      this.logger.error(`Failed to update order: ${orderServiceError}`);
      throw new BadRequestException(orderServiceError || 'Failed to update order');
    }
  }

  async addProfit(
    orderCode: string,
    profitDto: AddProfitDto,
    adminToken?: string,
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.orderServiceUrl}/admin/${orderCode}/profit`,
          profitDto,
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      const orderServiceError = error.response?.data?.message || error.message;
      this.logger.error(`Failed to add profit: ${orderServiceError}`);
      throw new BadRequestException(orderServiceError || 'Failed to add profit');
    }
  }

  async addFiles(
    orderCode: string,
    filesDto: AddFilesDto,
    adminToken?: string,
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.orderServiceUrl}/admin/${orderCode}/files`,
          filesDto,
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      this.logger.error(`Failed to add files: ${error.message}`);
      throw new BadRequestException('Failed to add files');
    }
  }

  async deleteOrder(orderCode: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.delete(`${this.orderServiceUrl}/admin/${orderCode}`, {
          headers: this.getHeaders(adminToken),
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      this.logger.error(`Failed to delete order: ${error.message}`);
      throw new BadRequestException('Failed to delete order');
    }
  }

  async changeOrderStatus(
    orderCode: string,
    status: OrderStatus,
    reason?: string,
    adminToken?: string,
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.orderServiceUrl}/admin/${orderCode}/status`,
          { status, reason },
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      this.logger.error(`Failed to change order status: ${error.message}`);
      throw new BadRequestException('Failed to change order status');
    }
  }

  async getOrderStatusHistory(orderCode: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.orderServiceUrl}/admin/${orderCode}/status-history`,
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      this.logger.error(`Failed to fetch status history: ${error.message}`);
      throw new BadRequestException('Failed to fetch status history');
    }
  }

  async getOrderTransactions(orderCode: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.orderServiceUrl}/admin/${orderCode}/payments`,
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Order ${orderCode} not found`);
      }
      this.logger.error(`Failed to fetch transactions: ${error.message}`);
      throw new BadRequestException('Failed to fetch transactions');
    }
  }
}
