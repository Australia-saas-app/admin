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
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { SimpleAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  CreateTextMessageDto,
  CreateFileMessageDto,
  CreateVoiceMessageDto,
  CreateCallMessageDto,
} from './dto/create-message.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { SearchMessageDto, MessageStatsDto, ExportMessageDto } from './dto/message-query.dto';
import { FileStorageClientService } from '../integration/file-storage-client.service';
import { FileUploadValidator } from '../rules/file-upload-validator';

@ApiTags('messages')
@Controller('conversations/:conversationId/messages')
@UseGuards(SimpleAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly fileStorageClient: FileStorageClientService,
    private readonly fileUploadValidator: FileUploadValidator,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Send text message' })
  async sendTextMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateTextMessageDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const senderType = user.isAdmin ? 'admin' : user.isBusiness ? 'business' : 'user';
    return this.messageService.createTextMessage(conversationId, user.userId, senderType, dto, token);
  }

  @Post('file')
  @ApiOperation({ summary: 'Upload and send file message' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async sendFileMessage(
    @Param('conversationId') conversationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    this.fileUploadValidator.validateFile(file);

    // Upload file to file storage service
    const fileUrl = await this.fileStorageClient.uploadFile(file, token);
    if (!fileUrl) {
      throw new Error('File upload failed');
    }

    const dto: CreateFileMessageDto = {
      fileUrl,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      caption,
    };

    const senderType = user.isAdmin ? 'admin' : user.isBusiness ? 'business' : 'user';
    return this.messageService.createFileMessage(conversationId, user.userId, senderType, dto, token);
  }

  @Post('voice')
  @ApiOperation({ summary: 'Upload and send voice message' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('voice'))
  async sendVoiceMessage(
    @Param('conversationId') conversationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    this.fileUploadValidator.validateFile(file);

    const voiceUrl = await this.fileStorageClient.uploadFile(file, token);
    if (!voiceUrl) {
      throw new Error('Voice upload failed');
    }

    const dto: CreateVoiceMessageDto = {
      voiceUrl,
      caption,
    };

    const senderType = user.isAdmin ? 'admin' : user.isBusiness ? 'business' : 'user';
    return this.messageService.createVoiceMessage(conversationId, user.userId, senderType, dto, token);
  }



  @Post('call')
  @ApiOperation({ summary: 'Log call message' })
  async sendCallMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateCallMessageDto,
    @CurrentUser() user: any,
  ) {
    const senderType = user.isAdmin ? 'admin' : user.isBusiness ? 'business' : 'user';
    return this.messageService.createCallMessage(conversationId, user.userId, senderType, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get messages from conversation' })
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query() filters: FilterMessageDto,
  ) {
    return this.messageService.getMessages(conversationId, filters);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  async markAsRead(
    @Param('id') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messageService.markAsRead(messageId, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message' })
  async deleteMessage(
    @Param('id') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messageService.deleteMessage(messageId, user.userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search messages in conversation' })
  async searchMessages(
    @Param('conversationId') conversationId: string,
    @Query() filters: SearchMessageDto,
  ) {
    return this.messageService.searchMessages(conversationId, filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get message statistics for conversation' })
  async getMessageStats(
    @Param('conversationId') conversationId: string,
    @Query() filters: MessageStatsDto,
  ) {
    return this.messageService.getMessageStats(conversationId, filters);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export messages from conversation' })
  async exportMessages(
    @Param('conversationId') conversationId: string,
    @Query() filters: ExportMessageDto,
  ) {
    return this.messageService.exportMessages(conversationId, filters);
  }
}

