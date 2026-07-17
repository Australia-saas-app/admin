import {
  Controller,
  Get,
  Post,
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
import { PaymentManagementService } from './payment-management.service';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { IssueRefundDto } from './dto/issue-refund.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { Request } from 'express';

@ApiTags('payments')
@Controller('payments')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentManagementController {
  constructor(
    private readonly paymentManagementService: PaymentManagementService,
  ) {}

  private getToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    return authHeader?.split(' ')[1];
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions with filters' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  getTransactions(@Query() query: TransactionQueryDto, @Req() req: Request) {
    return this.paymentManagementService.getTransactions(query, this.getToken(req));
  }

  @Get('transactions/:transactionId')
  @ApiOperation({ summary: 'Get transaction details by ID' })
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Transaction details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  getTransactionDetails(
    @Param('transactionId') transactionId: string,
    @Req() req: Request,
  ) {
    return this.paymentManagementService.getTransactionDetails(transactionId, this.getToken(req));
  }

  @Get('success-payments')
  @ApiOperation({ summary: 'Get successful payment transactions' })
  @ApiResponse({ status: 200, description: 'Success payments retrieved successfully' })
  getSuccessPayments(@Query() query: TransactionQueryDto, @Req() req: Request) {
    return this.paymentManagementService.getSuccessPayments(query, this.getToken(req));
  }

  @Get('penalty')
  @ApiOperation({ summary: 'Get penalty payments' })
  @ApiResponse({ status: 200, description: 'Penalty payments retrieved successfully' })
  getPenaltyPayments(@Query() query: TransactionQueryDto, @Req() req: Request) {
    return this.paymentManagementService.getPenaltyPayments(query, this.getToken(req));
  }

  @Get('security-deposits')
  @ApiOperation({ summary: 'Get security deposit payments' })
  @ApiResponse({ status: 200, description: 'Security deposits retrieved successfully' })
  getSecurityDeposits(@Query() query: TransactionQueryDto, @Req() req: Request) {
    return this.paymentManagementService.getSecurityDeposits(query, this.getToken(req));
  }

  @Get('success-refunds')
  @ApiOperation({ summary: 'Get successful refund transactions' })
  @ApiResponse({ status: 200, description: 'Success refunds retrieved successfully' })
  getRefundTransactions(@Query() query: TransactionQueryDto, @Req() req: Request) {
    return this.paymentManagementService.getRefundTransactions(query, this.getToken(req));
  }

  @Get('project-due-amounts')
  @ApiOperation({ summary: 'Get project due amounts' })
  @ApiResponse({ status: 200, description: 'Project due amounts retrieved successfully' })
  getProjectDueAmounts(@Query() query: TransactionQueryDto, @Req() req: Request) {
    return this.paymentManagementService.getProjectDueAmounts(query, this.getToken(req));
  }

  @Get('profile-amounts')
  @ApiOperation({ summary: 'Get profile amounts (delivery status orders)' })
  @ApiResponse({ status: 200, description: 'Profile amounts retrieved successfully' })
  getProfileAmounts(@Query() query: TransactionQueryDto, @Req() req: Request) {
    return this.paymentManagementService.getProfileAmounts(query, this.getToken(req));
  }

  @Post('transactions/:transactionId/refund')
  @ApiOperation({ summary: 'Issue refund for a transaction' })
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  @ApiResponse({ status: 201, description: 'Refund issued successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  issueRefund(
    @Param('transactionId') transactionId: string,
    @Body() refundDto: IssueRefundDto,
    @Req() req: Request,
  ) {
    return this.paymentManagementService.issueRefund(
      transactionId,
      refundDto,
      this.getToken(req),
    );
  }

  @Get('transactions/:transactionId/refund-history')
  @ApiOperation({ summary: 'Get refund history for a transaction' })
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Refund history retrieved successfully' })
  getRefundHistory(
    @Param('transactionId') transactionId: string,
    @Req() req: Request,
  ) {
    return this.paymentManagementService.getRefundHistory(transactionId, this.getToken(req));
  }
}
