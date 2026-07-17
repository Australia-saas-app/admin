import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessageService } from './message.service';
import { SimpleAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  UserToBusinessMessageDto,
  BusinessToUserMessageDto,
} from './dto/create-message.dto';

@ApiTags('messages')
@Controller('messages')
@UseGuards(SimpleAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DirectMessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('search-users')
  @ApiOperation({ summary: 'Search users I have chatted with by name' })
  async searchUsers(
    @Query('name') name: string,
    @CurrentUser() user: any,
  ) {
    return this.messageService.searchChatUsers(user.userId, name);
  }

  @Post('user-to-business')
  @UseInterceptors(FilesInterceptor('attachments'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User sends message to business' })
  async sendUserToBusiness(
    @Body() dto: UserToBusinessMessageDto,
    @CurrentUser() user: any,
    @Req() req: any,
    @UploadedFiles() attachments?: Express.Multer.File[],
  ) {
    // Note: In a real system, we'd verify 'user' is indeed a regular user
    const token = req.headers.authorization?.split(' ')[1];
    return this.messageService.sendUserToBusinessMessage(user.userId, dto, token, attachments);
  }

  @Post('business-to-user')
  @UseInterceptors(FilesInterceptor('attachments'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Business sends message to user' })
  async sendBusinessToUser(
    @Body() dto: BusinessToUserMessageDto,
    @CurrentUser() user: any,
    @Req() req: any,
    @UploadedFiles() attachments?: Express.Multer.File[],
  ) {
    // Note: In a real system, we'd verify 'user' is indeed a business
    const token = req.headers.authorization?.split(' ')[1];
    const businessId = user.businessId || user.userId;
    return this.messageService.sendBusinessToUserMessage(businessId, dto, token, attachments);
  }

  @Delete('user-to-business/:id')
  @ApiOperation({ summary: 'Soft delete a user-to-business message' })
  async deleteUserToBusinessMessage(
    @Param('id') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messageService.deleteMessage(messageId, user.userId);
  }

  @Delete('business-to-user/:id')
  @ApiOperation({ summary: 'Soft delete a business-to-user message' })
  async deleteBusinessToUserMessage(
    @Param('id') messageId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.businessId || user.userId;
    return this.messageService.deleteMessage(messageId, userId);
  }
}
