import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrderManagementService } from './order-management.service';
import { OrderQueryDto, OrderStatus } from './dto/order-query.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AddProfitDto } from './dto/add-profit.dto';
import { AddFilesDto } from './dto/add-files.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { Request } from 'express';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class OrderManagementController {
  constructor(private readonly orderManagementService: OrderManagementService) {}

  private getToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    return authHeader?.split(' ')[1];
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of orders with filters' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  getOrders(@Query() query: OrderQueryDto, @Req() req: Request) {
    return this.orderManagementService.getOrders(query, this.getToken(req));
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrderDetails(@Param('orderId') orderId: string, @Req() req: Request) {
    return this.orderManagementService.getOrderDetails(orderId, this.getToken(req));
  }

  @Patch(':orderId')
  @ApiOperation({ summary: 'Update order information (pending status only)' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateDto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    return this.orderManagementService.updateOrder(orderId, updateDto, this.getToken(req));
  }

  @Post(':orderId/profit')
  @ApiOperation({ summary: 'Add profit to order (waiting status only)' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 201, description: 'Profit added successfully' })
  addProfit(
    @Param('orderId') orderId: string,
    @Body() profitDto: AddProfitDto,
    @Req() req: Request,
  ) {
    return this.orderManagementService.addProfit(orderId, profitDto, this.getToken(req));
  }

  @Post(':orderId/files')
  @ApiOperation({ summary: 'Add files to order (working status only)' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 201, description: 'Files added successfully' })
  addFiles(
    @Param('orderId') orderId: string,
    @Body() filesDto: AddFilesDto,
    @Req() req: Request,
  ) {
    return this.orderManagementService.addFiles(orderId, filesDto, this.getToken(req));
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Delete order' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  deleteOrder(@Param('orderId') orderId: string, @Req() req: Request) {
    return this.orderManagementService.deleteOrder(orderId, this.getToken(req));
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Change order status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status changed successfully' })
  changeOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: OrderStatus,
    @Body('reason') reason: string,
    @Req() req: Request,
  ) {
    return this.orderManagementService.changeOrderStatus(orderId, status, reason, this.getToken(req));
  }

  @Get(':orderId/status-history')
  @ApiOperation({ summary: 'Get order status change history' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Status history retrieved successfully' })
  getOrderStatusHistory(@Param('orderId') orderId: string, @Req() req: Request) {
    return this.orderManagementService.getOrderStatusHistory(orderId, this.getToken(req));
  }

  @Get(':orderId/transactions')
  @ApiOperation({ summary: 'Get order transactions' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order transactions retrieved successfully' })
  getOrderTransactions(@Param('orderId') orderId: string, @Req() req: Request) {
    return this.orderManagementService.getOrderTransactions(orderId, this.getToken(req));
  }
}

