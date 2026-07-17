import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessControlDto } from './dto/access-control.dto';
import { AssignAdminDto } from './dto/assign-admin.dto';
import { AccessScopeDto } from './dto/access-scope.dto';
import { BookingStatusChangeDto } from './dto/status-change.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DeliveryFileDto } from './dto/delivery-file.dto';
import { DocumentDto } from './dto/document.dto';
import { PaymentDto } from './dto/payment.dto';
import { ProfitDto } from './dto/profit.dto';
import { RefundDto } from './dto/refund.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request.interface';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  private ensureUser(req: RequestWithUser, allowed: string[]) {
    const user = req.user;
    if (!user || !allowed.includes(user.accountType)) {
      throw new ForbiddenException(`Only ${allowed.join('/')} accounts can perform this action`);
    }
    return user;
  }

  private ensureOwnership(entity: { userId?: string; agencyId?: string }, user: { userId: string; accountType: string }) {
    if (user.accountType === 'admin') return;
    const isOwner = entity.userId === user.userId || entity.agencyId === user.userId;
    if (!isOwner) {
      throw new ForbiddenException('You do not have access to this booking');
    }
  }

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateBookingDto) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const payload = { ...dto };
    if (user.accountType === 'user') {
      payload.userId = user.userId;
      payload.agencyId = undefined;
    } else if (user.accountType === 'agency') {
      payload.agencyId = user.userId;
      payload.userId = undefined;
    }
    return this.bookingsService.create(payload);
  }

  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query('userId') userId?: string,
    @Query('agencyId') agencyId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const filters = {
      userId,
      agencyId,
      status,
      startDate,
      endDate,
      page,
      limit,
    };
    if (user.accountType !== 'admin') {
      filters.userId = undefined;
      filters.agencyId = undefined;
      if (user.accountType === 'user') filters.userId = user.userId;
      if (user.accountType === 'agency') filters.agencyId = user.userId;
    }
    return this.bookingsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const booking = await this.bookingsService.findOne(id);
    this.ensureOwnership(booking, user);
    return booking;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const booking = await this.bookingsService.findOne(id);
    this.ensureOwnership(booking, user);
    return this.bookingsService.update(id, dto);
  }

  @Post(':id/status')
  changeStatus(@Param('id') id: string, @Body() dto: BookingStatusChangeDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.changeStatus(id, dto);
  }

  @Post(':id/paid')
  async markPayment(@Param('id') id: string, @Body() dto: PaymentDto, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const booking = await this.bookingsService.findOne(id);
    this.ensureOwnership(booking, user);
    return this.bookingsService.markPayment(id, dto);
  }

  @Post(':id/refund')
  refund(@Param('id') id: string, @Body() dto: RefundDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.refund(id, dto);
  }

  @Post(':id/access')
  access(@Param('id') id: string, @Body() dto: AccessControlDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.updateAccess(id, dto);
  }

  @Post(':id/access-scope')
  accessScope(@Param('id') id: string, @Body() dto: AccessScopeDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.setAccessScope(id, dto);
  }

  @Post(':id/delivery')
  setDelivery(@Param('id') id: string, @Body() dto: DeliveryFileDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.setDeliveryFile(id, dto);
  }

  @Post(':id/documents')
  addDocument(@Param('id') id: string, @Body() dto: DocumentDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.addDocument(id, dto);
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignAdminDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.assignAdmin(id, dto);
  }

  @Post(':id/profit')
  addProfit(@Param('id') id: string, @Body() dto: ProfitDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.bookingsService.addProfit(id, dto);
  }

  @Get('stats/summary')
  stats(
    @Req() req: RequestWithUser,
    @Query('userId') userId?: string,
    @Query('agencyId') agencyId?: string,
  ) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    let filters = { userId, agencyId };
    if (user.accountType !== 'admin') {
      filters = { userId: undefined, agencyId: undefined };
      if (user.accountType === 'user') filters.userId = user.userId;
      if (user.accountType === 'agency') filters.agencyId = user.userId;
    }
    return this.bookingsService.stats(filters);
  }

  @Get(':id/timeline')
  async timeline(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const booking = await this.bookingsService.findOne(id);
    this.ensureOwnership(booking, user);
    return this.bookingsService.timeline(id);
  }
}

