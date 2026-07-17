import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import type { PaginatedResponse } from './orders.service';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { RequestWithUser, RequestWithAdmin } from '../common/interfaces/request.interface';
import { CreateOrderDto, DocumentDto } from './dto/create-order.dto';
import { OrderQueryDto, AdminOrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StatusChangeDto } from './dto/status-change.dto';
import { AddProfitDto } from './dto/add-profit.dto';
import { AddFilesDto } from './dto/add-files.dto';
import { AddPaymentDto } from './dto/add-payment.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check() {
    return {
      status: 'ok',
      service: 'order-service',
      timestamp: new Date().toISOString(),
    };
  }

  // ===========================
  // USER / AGENCY ROUTES
  // ===========================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new order' })
  createOrder(@Body() dto: CreateOrderDto, @Req() req: RequestWithUser) {
    return this.ordersService.createOrder(dto, this.getUser(req));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List requester orders with filters' })
  listMyOrders(
    @Query() query: OrderQueryDto,
    @Req() req: RequestWithUser,
  ): Promise<PaginatedResponse<Order>> {
    return this.ordersService.listOrdersForOwner(query, this.getUser(req));
  }

  @Get('chat-enabled')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get orders eligible for chat (pending or working status)' })
  getChatEnabledOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: RequestWithUser,
  ): Promise<PaginatedResponse<Order>> {
    return this.ordersService.getChatEnabledOrders(
      this.getUser(req),
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':orderCode([A-Z0-9-]+)')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'orderCode', description: 'Unique order identifier' })
  @ApiOperation({ summary: 'Get a single order owned by requester' })
  getMyOrder(@Param('orderCode') orderCode: string, @Req() req: RequestWithUser) {
    return this.ordersService.getOrderForOwner(orderCode, this.getUser(req));
  }

  @Patch(':orderCode([A-Z0-9-]+)')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update editable fields for pending orders' })
  updateMyOrder(
    @Param('orderCode') orderCode: string,
    @Body() dto: UpdateOrderDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ordersService.updateOrderAsOwner(orderCode, dto, this.getUser(req));
  }

  @Post(':orderCode([A-Z0-9-]+)/documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Append additional documents to an order' })
  addDocuments(
    @Param('orderCode') orderCode: string,
    @Body('documents') documents: DocumentDto[],
    @Req() req: RequestWithUser,
  ) {
    return this.ordersService.addDocuments(orderCode, documents ?? [], this.getUser(req));
  }

  @Get('public/real-estate/list')
  @ApiOperation({ summary: 'Public listing for verified real-estate orders' })
  listPublicRealEstate(@Query() query: OrderQueryDto) {
    return this.ordersService.getPublicRealEstateOrders(query);
  }

  // ===========================
  // ADMIN ROUTES
  // ===========================

  @Get('admin/list')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - list orders with analytics' })
  listAdminOrders(
    @Query() query: AdminOrderQueryDto,
  ): Promise<PaginatedResponse<Order>> {
    return this.ordersService.listAdminOrders(query);
  }

  @Get('admin/:orderCode')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiParam({ name: 'orderCode' })
  @ApiOperation({ summary: 'Admin - get order details' })
  getAdminOrder(@Param('orderCode') orderCode: string) {
    return this.ordersService.getAdminOrder(orderCode);
  }

  @Patch('admin/:orderCode')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - update pending order data' })
  updateAdminOrder(
    @Param('orderCode') orderCode: string,
    @Body() dto: UpdateOrderDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.ordersService.updateOrderAsAdmin(orderCode, dto, this.getAdmin(req));
  }

  @Patch('admin/:orderCode/status')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - change order status' })
  changeStatus(
    @Param('orderCode') orderCode: string,
    @Body() dto: StatusChangeDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.ordersService.changeStatus(orderCode, dto, this.getAdmin(req));
  }

  @Post('admin/:orderCode/profit')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - add profit to waiting order' })
  addProfit(
    @Param('orderCode') orderCode: string,
    @Body() dto: AddProfitDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.ordersService.addProfit(orderCode, dto, this.getAdmin(req));
  }

  @Post('admin/:orderCode/files')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - attach delivery files' })
  addFiles(
    @Param('orderCode') orderCode: string,
    @Body() dto: AddFilesDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.ordersService.addAdminFiles(orderCode, dto, this.getAdmin(req));
  }

  @Post('admin/:orderCode/payments')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - record payment events' })
  addPayment(
    @Param('orderCode') orderCode: string,
    @Body() dto: AddPaymentDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.ordersService.recordPayment(orderCode, dto, this.getAdmin(req));
  }

  @Get('admin/:orderCode/payments')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - get order payments' })
  getOrderPayments(@Param('orderCode') orderCode: string) {
    return this.ordersService.getOrderPayments(orderCode);
  }

  @Get('admin/:orderCode/status-history')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - fetch status audit trail' })
  getStatusHistory(@Param('orderCode') orderCode: string) {
    return this.ordersService.getStatusHistory(orderCode);
  }

  @Delete('admin/:orderCode')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('admin-orders')
  @ApiOperation({ summary: 'Admin - delete order' })
  deleteOrder(@Param('orderCode') orderCode: string) {
    return this.ordersService.deleteOrder(orderCode);
  }

  private getUser(req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('Missing user context');
    }
    return req.user;
  }

  private getAdmin(req: RequestWithAdmin) {
    if (!req.admin) {
      throw new UnauthorizedException('Missing admin context');
    }
    return req.admin;
  }
}

