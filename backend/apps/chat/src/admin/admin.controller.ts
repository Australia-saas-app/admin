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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SimpleAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  AssignConversationDto,
  ForwardConversationDto,
  BlockUserDto,
  ToggleFeatureDto,
} from './dto/assign-conversation.dto';
import { CreatePredefinedMessageDto, UpdatePredefinedMessageDto } from './dto/predefined-message.dto';
import { SetExpirationDto } from '../conversation/dto/update-conversation.dto';
import { FilterConversationDto } from '../conversation/dto/filter-conversation.dto';
import { AssignTopicToSubAdminDto } from './dto/topic-assignment.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(SimpleAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations (admin)' })
  async getAllConversations(
    @Query() filters: FilterConversationDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.adminService.getAllConversations(filters, user.adminId, token);
  }

  @Get('conversations/requests')
  @ApiOperation({ summary: 'Get unassigned conversations' })
  async getUnassignedConversations(
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.adminService.getUnassignedConversations(token);
  }

  @Get('conversations/assigned')
  @ApiOperation({ summary: 'Get assigned conversations' })
  async getAssignedConversations(@CurrentUser() user: any) {
    return this.adminService.getAssignedConversations(user.adminId);
  }

  @Post('conversations/:id/assign')
  @ApiOperation({ summary: 'Assign conversation to admin' })
  async assignConversation(
    @Param('id') conversationId: string,
    @Body() dto: AssignConversationDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.assignConversation(conversationId, dto, user.adminId);
  }

  @Post('conversations/:id/unassign')
  @ApiOperation({ summary: 'Unassign conversation' })
  @HttpCode(HttpStatus.OK)
  async unassignConversation(
    @Param('id') conversationId: string,
    @CurrentUser() user: any,
  ) {
    return this.adminService.unassignConversation(conversationId, user.adminId);
  }

  @Post('conversations/:id/forward')
  @ApiOperation({ summary: 'Forward conversation to another admin' })
  async forwardConversation(
    @Param('id') conversationId: string,
    @Body() dto: ForwardConversationDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.forwardConversation(conversationId, dto, user.adminId);
  }

  @Post('conversations/:id/block')
  @ApiOperation({ summary: 'Block user/agency in conversation' })
  async blockUser(
    @Param('id') conversationId: string,
    @Body() dto: BlockUserDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.blockUser(conversationId, dto, user.adminId);
  }

  @Post('conversations/:id/unblock')
  @ApiOperation({ summary: 'Unblock user/agency in conversation' })
  @HttpCode(HttpStatus.OK)
  async unblockUser(
    @Param('id') conversationId: string,
    @CurrentUser() user: any,
  ) {
    return this.adminService.unblockUser(conversationId, user.adminId);
  }

  @Put('conversations/:id/message-toggle')
  @ApiOperation({ summary: 'Toggle messaging for conversation' })
  async toggleMessage(
    @Param('id') conversationId: string,
    @Body() dto: ToggleFeatureDto,
  ) {
    return this.adminService.toggleMessage(conversationId, dto);
  }

  @Put('conversations/:id/call-toggle')
  @ApiOperation({ summary: 'Toggle calling for conversation' })
  async toggleCall(
    @Param('id') conversationId: string,
    @Body() dto: ToggleFeatureDto,
  ) {
    return this.adminService.toggleCall(conversationId, dto);
  }

  @Put('conversations/:id/file-toggle')
  @ApiOperation({ summary: 'Toggle file upload for conversation' })
  async toggleFileUpload(
    @Param('id') conversationId: string,
    @Body() dto: ToggleFeatureDto,
  ) {
    return this.adminService.toggleFileUpload(conversationId, dto);
  }

  @Put('conversations/:id/voice-toggle')
  @ApiOperation({ summary: 'Toggle voice upload for conversation' })
  async toggleVoiceUpload(
    @Param('id') conversationId: string,
    @Body() dto: ToggleFeatureDto,
  ) {
    return this.adminService.toggleVoiceUpload(conversationId, dto);
  }

  @Put('conversations/:id/expiration')
  @ApiOperation({ summary: 'Set custom expiration for conversation' })
  async setExpiration(
    @Param('id') conversationId: string,
    @Body() dto: SetExpirationDto,
  ) {
    return this.adminService.setExpiration(conversationId, dto);
  }

  @Get('predefined-messages')
  @ApiOperation({ summary: 'Get all predefined messages' })
  async getPredefinedMessages(@CurrentUser() user: any) {
    return this.adminService.getPredefinedMessages(user.adminId);
  }

  @Post('predefined-messages')
  @ApiOperation({ summary: 'Create predefined message' })
  async createPredefinedMessage(
    @Body() dto: CreatePredefinedMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.createPredefinedMessage(user.adminId, dto);
  }

  @Put('predefined-messages/:id')
  @ApiOperation({ summary: 'Update predefined message' })
  async updatePredefinedMessage(
    @Param('id') id: string,
    @Body() dto: UpdatePredefinedMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.updatePredefinedMessage(id, user.adminId, dto);
  }

  @Delete('predefined-messages/:id')
  @ApiOperation({ summary: 'Delete predefined message' })
  @HttpCode(HttpStatus.OK)
  async deletePredefinedMessage(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.adminService.deletePredefinedMessage(id, user.adminId);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get assigned users list' })
  async getAssignedUsers(@CurrentUser() user: any) {
    return this.adminService.getAssignedUsers(user.adminId);
  }


  @Post('topics/assign')
  @ApiOperation({ summary: 'Assign topic to sub-admins' })
  async assignTopicToSubAdmins(
    @Body() dto: AssignTopicToSubAdminDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.assignTopicToSubAdmins(dto.topic, dto.subAdminIds, user.adminId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get chat statistics' })
  async getStats() {
    return this.adminService.getStats();
  }
}

