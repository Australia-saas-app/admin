import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { SimpleAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  CreateLiveChatDto,
  CreateOrderChatDto,
  CreateBusinessChatDto,
} from './dto/create-conversation.dto';
import { FilterConversationDto } from './dto/filter-conversation.dto';
import { SubmitRatingDto, SetExpirationDto } from './dto/update-conversation.dto';

@ApiTags('live-chat', 'order-chat', 'business-chat')
@Controller()
@UseGuards(SimpleAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('live/conversations')
  @ApiOperation({ summary: 'Create live chat conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created' })
  async createLiveChat(
    @Body() dto: CreateLiveChatDto,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.createLiveChat(dto, user.userId);
  }

  @Post('order/conversations')
  @ApiOperation({ summary: 'Create order chat conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created' })
  async createOrderChat(
    @Body() dto: CreateOrderChatDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.conversationService.createOrderChat(dto, user.userId, token);
  }

  @Post('business/conversations')
  @ApiOperation({ summary: 'Create business chat conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created' })
  async createBusinessChat(
    @Body() dto: CreateBusinessChatDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const businessId = user.businessId || user.userId;
    return this.conversationService.createBusinessChat(dto, businessId, token);
  }

  @Get('live/conversations')
  @ApiOperation({ summary: 'Get user live chat conversations' })
  async getLiveChats(
    @Query() filters: FilterConversationDto,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.getUserConversations(user.userId, 'live', filters);
  }

  @Get('order/conversations')
  @ApiOperation({ summary: 'Get user order chat conversations' })
  async getOrderChats(
    @Query() filters: FilterConversationDto,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.getUserConversations(user.userId, 'order', filters);
  }

  @Get('order/conversations/:orderId')
  @ApiOperation({ summary: 'Get conversation by order ID' })
  async getOrderConversation(
    @Param('orderId') orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.getOrderConversation(orderId, user.userId);
  }

  @Get('business/conversations')
  @ApiOperation({ summary: 'Get business chat conversations' })
  async getBusinessChats(
    @Query() filters: FilterConversationDto,
    @CurrentUser() user: any,
  ) {
    const businessId = user.businessId || user.userId;
    return this.conversationService.getUserConversations(businessId, 'business', filters);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  async getConversation(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.getConversationById(id, user.userId);
  }

  @Post('live/conversations/:id/rating')
  @ApiOperation({ summary: 'Submit rating for live chat' })
  @HttpCode(HttpStatus.OK)
  async submitRating(
    @Param('id') id: string,
    @Body() dto: SubmitRatingDto,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.submitRating(id, user.userId, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all user conversations' })
  async getAllConversations(
    @Query() filters: FilterConversationDto,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.getUserConversations(user.userId, undefined, filters);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Close conversation' })
  @HttpCode(HttpStatus.OK)
  async closeConversation(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.closeConversation(id, user.userId);
  }
}
