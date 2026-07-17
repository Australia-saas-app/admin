import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BOOKING_STATUSES, BookingStatus } from '../common/status.constants';
import { StatusHistoryService } from '../status-history/status-history.service';
import { AccessControlDto } from './dto/access-control.dto';
import { AccessScopeDto } from './dto/access-scope.dto';
import { DeliveryFileDto } from './dto/delivery-file.dto';
import { AssignAdminDto } from './dto/assign-admin.dto';
import { PaymentDto } from './dto/payment.dto';
import { ProfitDto } from './dto/profit.dto';
import { RefundDto } from './dto/refund.dto';
import { BookingStatusChangeDto } from './dto/status-change.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DocumentDto } from './dto/document.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    private readonly historyService: StatusHistoryService,
  ) {}

  private readonly transitions: Record<BookingStatus, BookingStatus[]> = {
    pending: ['payment', 'waiting', 'working', 'cancel'],
    payment: ['waiting', 'working', 'cancel', 'refund'],
    waiting: ['working', 'cancel', 'refund'],
    working: ['stopped', 'complete', 'cancel', 'refund'],
    stopped: ['working', 'cancel', 'refund'],
    complete: ['delivery', 'refund'],
    delivery: ['refund'],
    refund: [],
    cancel: [],
  };

  private isCommsEnabled(booking: Booking, channel: 'chat' | 'call' | 'file' | 'voice') {
    switch (channel) {
      case 'chat':
        return booking.chatEnabled;
      case 'call':
        return booking.callEnabled;
      case 'file':
        return booking.fileEnabled;
      case 'voice':
        return booking.voiceEnabled;
      default:
        return false;
    }
  }

  /**
   * Guard-style helper to enforce communication toggles before wiring chat/call/file/voice endpoints.
   * Usage (future): call before performing the action; throw if disabled.
   */
  async assertCommsAllowed(id: string, channel: 'chat' | 'call' | 'file' | 'voice') {
    const booking = await this.bookingModel.findById(id).lean().exec();
    if (!booking) throw new NotFoundException('Booking not found');
    if (!this.isCommsEnabled(booking as Booking, channel)) {
      throw new BadRequestException(`${channel} is disabled for this booking`);
    }
    return booking;
  }

  private assertStatus(status: string): asserts status is BookingStatus {
    if (!BOOKING_STATUSES.includes(status as BookingStatus)) {
      throw new BadRequestException('Invalid status');
    }
  }

  async create(dto: CreateBookingDto) {
    if (!dto.userId && !dto.agencyId) {
      throw new BadRequestException('userId or agencyId required');
    }

    const payload: Partial<Booking> = {
      ...dto,
      customTrip: dto.customTrip ?? false,
      status: 'pending',
      currency: dto.currency || 'USD',
      passengers: dto.passengers || [],
      documents: dto.documents || [],
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      currentAddress: dto.currentAddress || {},
      destinationAddress: dto.destinationAddress || {},
      dates: {
        start: dto.startDate ? new Date(dto.startDate) : undefined,
        end: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      paid: 0,
      due: dto.price,
      description: dto.description,
      referenceName: dto.referenceName,
      chatEnabled: true,
      callEnabled: true,
      fileEnabled: true,
      voiceEnabled: true,
      accessScope: 'everyone',
      profit: 0,
    };

    const created = new this.bookingModel(payload);
    const saved = await created.save();
    await this.historyService.record({
      entityType: 'booking',
      entityId: saved._id.toString(),
      toStatus: 'pending',
      note: 'Created',
    });
    return saved;
  }

  async findAll(filter: {
    userId?: string;
    agencyId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const q: Record<string, unknown> = {};
    if (filter.userId) q.userId = filter.userId;
    if (filter.agencyId) q.agencyId = filter.agencyId;
    if (filter.status) q.status = filter.status;
    if (filter.startDate || filter.endDate) {
      q.createdAt = {};
      if (filter.startDate) (q.createdAt as any)['$gte'] = new Date(filter.startDate);
      if (filter.endDate) (q.createdAt as any)['$lte'] = new Date(filter.endDate);
    }
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filter.limit) || 20));
    return this.bookingModel
      .find(q)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const booking = await this.bookingModel.findById(id).lean().exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'pending') {
      throw new BadRequestException('Only pending bookings can be updated');
    }

    if (dto.startDate || dto.endDate) {
      booking.dates = {
        start: dto.startDate ? new Date(dto.startDate) : booking.dates?.start,
        end: dto.endDate ? new Date(dto.endDate) : booking.dates?.end,
      };
    }

    Object.assign(booking, {
      ...dto,
      currency: dto.currency || booking.currency,
      passengers: dto.passengers || booking.passengers,
      metadata: dto.metadata || booking.metadata,
      customTrip: dto.customTrip ?? booking.customTrip,
    });

    await booking.save();
    return booking.toObject();
  }

  async changeStatus(id: string, dto: BookingStatusChangeDto) {
    this.assertStatus(dto.toStatus);
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');

    const previous = booking.status;
    const allowed = this.transitions[previous] || [];
    if (!allowed.includes(dto.toStatus as BookingStatus)) {
      throw new BadRequestException(`Cannot move from ${previous} to ${dto.toStatus}`);
    }

    booking.status = dto.toStatus as BookingStatus;

    // toggle chat/call/file/voice based on lifecycle rules
    const interactiveStatuses: BookingStatus[] = ['pending', 'payment', 'waiting', 'working', 'complete'];
    const enable = interactiveStatuses.includes(dto.toStatus as BookingStatus);
    booking.chatEnabled = enable;
    booking.callEnabled = enable;
    booking.fileEnabled = enable;
    booking.voiceEnabled = enable;

    await booking.save();
    await this.historyService.record({
      entityType: 'booking',
      entityId: booking._id.toString(),
      fromStatus: previous,
      toStatus: dto.toStatus,
      actorId: dto.actorId,
      note: dto.note,
    });
    return booking.toObject();
  }

  async markPayment(id: string, dto: PaymentDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    const amount = dto.amount;
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    booking.paid += amount;
    booking.due = Math.max(0, booking.price - booking.paid);

    // Move into payment stage if it was still pending.
    if (booking.status === 'pending') {
      const prev = booking.status;
      booking.status = 'payment';
      await this.historyService.record({
        entityType: 'booking',
        entityId: booking._id.toString(),
        fromStatus: prev,
        toStatus: 'payment',
        note: 'Payment started',
      });
    }

    // Auto-complete and deliver when fully paid and at/after payment stages.
    if (booking.due === 0 && ['payment', 'waiting', 'working', 'complete'].includes(booking.status)) {
      const prev = booking.status;
      booking.status = 'delivery';
      await this.historyService.record({
        entityType: 'booking',
        entityId: booking._id.toString(),
        fromStatus: prev,
        toStatus: 'delivery',
        note: 'Auto-delivery on full payment',
      });
    }

    booking.transactions.push({
      kind: 'payment',
      amount,
      fee: 0,
      createdAt: new Date(),
    });
    await booking.save();
    return booking.toObject();
  }

  async refund(id: string, dto: RefundDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    const amount = dto.amount;
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    if (amount > booking.paid) {
      throw new BadRequestException('Refund exceeds paid amount');
    }
    booking.paid -= amount;
    booking.due = Math.max(0, booking.price - booking.paid);
    const previous = booking.status;
    booking.status = 'refund';
    booking.transactions.push({
      kind: 'refund',
      amount,
      fee: dto.fee || 0,
      createdAt: new Date(),
    });
    await booking.save();
    await this.historyService.record({
      entityType: 'booking',
      entityId: booking._id.toString(),
      fromStatus: previous,
      toStatus: 'refund',
      note: 'Refund issued',
    });
    return booking.toObject();
  }

  async updateAccess(id: string, dto: AccessControlDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    Object.assign(booking, {
      chatEnabled: dto.chatEnabled ?? booking.chatEnabled,
      callEnabled: dto.callEnabled ?? booking.callEnabled,
      fileEnabled: dto.fileEnabled ?? booking.fileEnabled,
      voiceEnabled: dto.voiceEnabled ?? booking.voiceEnabled,
    });
    await booking.save();
    return booking.toObject();
  }

  async setDeliveryFile(id: string, dto: DeliveryFileDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    booking.deliveryFileKey = dto.deliveryFileKey;
    await booking.save();
    return booking.toObject();
  }

  async setAccessScope(id: string, dto: AccessScopeDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    booking.accessScope = dto.accessScope;
    await booking.save();
    return booking.toObject();
  }

  async addDocument(id: string, dto: DocumentDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    booking.documents = booking.documents || [];
    booking.documents.push(dto.key);
    await booking.save();
    return booking.toObject();
  }

  async assignAdmin(id: string, dto: AssignAdminDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    booking.assignedAdminId = dto.adminId;
    await booking.save();
    await this.historyService.record({
      entityType: 'booking',
      entityId: booking._id.toString(),
      toStatus: booking.status,
      actorId: dto.adminId,
      note: 'Admin assigned',
    });
    return booking.toObject();
  }

  async addProfit(id: string, dto: ProfitDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    booking.profit = (booking.profit || 0) + dto.amount;
    await booking.save();
    return booking.toObject();
  }

  async stats(filter: { userId?: string; agencyId?: string }) {
    const q: Record<string, unknown> = {};
    if (filter.userId) q.userId = filter.userId;
    if (filter.agencyId) q.agencyId = filter.agencyId;
    const pipeline = [
      { $match: q },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ];
    return this.bookingModel.aggregate(pipeline).exec();
  }

  async timeline(id: string) {
    return this.historyService.getTimeline('booking', id);
  }
}

