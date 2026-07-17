import { Controller, Get, UseGuards, Req, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SimpleAuthGuard } from '../common/auth.guard';
import { OrderClientService } from './order-client.service';

@ApiTags('integration')
@Controller()
@UseGuards(SimpleAuthGuard)
@ApiBearerAuth('JWT-auth')
export class IntegrationController {
  constructor(
    private readonly orderClientService: OrderClientService,
  ) {}

  @Get('validate/order/:orderCode')
  @ApiOperation({ summary: 'Validate if order allows chat' })
  @ApiResponse({ status: 200, description: 'Order validation result' })
  async validateOrderForChat(
    @Param('orderCode') orderCode: string,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const isValid = await this.orderClientService.validateOrderForChat(orderCode, token);
    return { allowsChat: isValid };
  }

  @Get('orders/enabled')
  @ApiOperation({ summary: 'Get orders that have chat enabled' })
  @ApiResponse({ status: 200, description: 'List of chat-enabled orders' })
  async getChatEnabledOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.orderClientService.getChatEnabledOrders(token, page, limit);
  }
}