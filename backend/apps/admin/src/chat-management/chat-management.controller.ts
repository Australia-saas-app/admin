import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatManagementService } from './chat-management.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { AdminRequest } from '../common/interfaces/request.interface';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatManagementController {
  constructor(private readonly chatManagementService: ChatManagementService) {}

  @Get('topics')
  @ApiOperation({ summary: 'Get all chat topics' })
  @ApiResponse({ status: 200, description: 'Chat topics retrieved successfully' })
  getChatTopics(@Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.getChatTopics(token);
  }

  @Post('topics')
  @ApiOperation({ summary: 'Create a new chat topic' })
  @ApiResponse({ status: 201, description: 'Chat topic created successfully' })
  createChatTopic(@Body() topicData: any, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.createChatTopic(topicData, token);
  }

  @Get('predefined-messages')
  @ApiOperation({ summary: 'Get all predefined messages' })
  @ApiResponse({ status: 200, description: 'Predefined messages retrieved successfully' })
  getPredefinedMessages(@Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.getPredefinedMessages(token);
  }

  @Post('predefined-messages')
  @ApiOperation({ summary: 'Create a new predefined message' })
  @ApiResponse({ status: 201, description: 'Predefined message created successfully' })
  createPredefinedMessage(@Body() messageData: any, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.createPredefinedMessage(messageData, token);
  }

  // Live Chat Management
  @Get('live')
  @ApiOperation({ summary: 'Get all live chats' })
  getLiveChats(@Query() query: any, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.getLiveChats(token, query);
  }

  @Patch('live/:userId/block')
  @ApiOperation({ summary: 'Block user in live chat' })
  blockUser(@Param('userId') userId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.blockUser(userId, token);
  }

  @Patch('live/:userId/messaging')
  @ApiOperation({ summary: 'Toggle messaging for user' })
  toggleMessaging(@Param('userId') userId: string, @Body('enabled') enabled: boolean, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.toggleMessaging(userId, enabled, token);
  }

  @Patch('live/:userId/calling')
  @ApiOperation({ summary: 'Toggle calling for user' })
  toggleCalling(@Param('userId') userId: string, @Body('enabled') enabled: boolean, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.toggleCalling(userId, enabled, token);
  }

  @Post('live/:userId/forward')
  @ApiOperation({ summary: 'Forward messages to another admin' })
  forwardMessage(@Param('userId') userId: string, @Body('targetAdminId') targetAdminId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.forwardMessage(userId, targetAdminId, token);
  }

  // Order Chat Management
  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get order chat messages' })
  getOrderChats(@Param('orderId') orderId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.getOrderChats(orderId, token);
  }

  @Patch('order/:orderId/user/:userId/block')
  @ApiOperation({ summary: 'Block user in order chat' })
  blockUserInOrderChat(@Param('orderId') orderId: string, @Param('userId') userId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.blockUserInOrderChat(orderId, userId, token);
  }

  @Patch('order/:orderId/user/:userId/messaging')
  @ApiOperation({ summary: 'Toggle messaging in order chat' })
  toggleOrderChatMessaging(@Param('orderId') orderId: string, @Param('userId') userId: string, @Body('enabled') enabled: boolean, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.toggleOrderChatMessaging(orderId, userId, enabled, token);
  }

  @Patch('order/:orderId/user/:userId/calling')
  @ApiOperation({ summary: 'Toggle calling in order chat' })
  toggleOrderChatCalling(@Param('orderId') orderId: string, @Param('userId') userId: string, @Body('enabled') enabled: boolean, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.toggleOrderChatCalling(orderId, userId, enabled, token);
  }

  // Agency Chat Management
  @Get('agency/:agencyId')
  @ApiOperation({ summary: 'Get agency chat messages' })
  getAgencyChats(@Param('agencyId') agencyId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.getAgencyChats(agencyId, token);
  }

  @Patch('agency/:agencyId/block')
  @ApiOperation({ summary: 'Block agency in chat' })
  blockAgency(@Param('agencyId') agencyId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.blockAgency(agencyId, token);
  }

  @Patch('agency/:agencyId/messaging')
  @ApiOperation({ summary: 'Toggle messaging for agency' })
  toggleAgencyMessaging(@Param('agencyId') agencyId: string, @Body('enabled') enabled: boolean, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.toggleAgencyMessaging(agencyId, enabled, token);
  }

  @Patch('agency/:agencyId/calling')
  @ApiOperation({ summary: 'Toggle calling for agency' })
  toggleAgencyCalling(@Param('agencyId') agencyId: string, @Body('enabled') enabled: boolean, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.chatManagementService.toggleAgencyCalling(agencyId, enabled, token);
  }

  // Conversation File Upload Toggle
   @Patch('conversations/:conversationId/file-toggle')
   @ApiOperation({ summary: 'Toggle file upload for conversation' })
   @ApiResponse({ status: 200, description: 'File upload toggled successfully' })
   toggleConversationFileUpload(
     @Param('conversationId') conversationId: string,
     @Body() body: { enabled: boolean },
     @Request() req: AdminRequest
   ) {
     const token = req.headers.authorization?.split(' ')[1] || '';
     return this.chatManagementService.toggleConversationFileUpload(conversationId, body.enabled, token);
   }
 }



