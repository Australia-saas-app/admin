import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification channel' })
  @ApiResponse({ status: 201, description: 'Channel created successfully' })
  async createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.createChannel(createChannelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notification channels' })
  @ApiResponse({ status: 200, description: 'Channels retrieved successfully' })
  async getChannels() {
    return this.channelsService.getChannels();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel retrieved successfully' })
  async getChannel(@Param('id') id: string) {
    return this.channelsService.getChannel(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification channel' })
  @ApiResponse({ status: 200, description: 'Channel updated successfully' })
  async updateChannel(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelsService.updateChannel(id, updateChannelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification channel' })
  @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
  async deleteChannel(@Param('id') id: string) {
    return this.channelsService.deleteChannel(id);
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: 'Toggle channel active status' })
  @ApiResponse({ status: 200, description: 'Channel status updated successfully' })
  async toggleChannel(@Param('id') id: string) {
    return this.channelsService.toggleChannel(id);
  }

  @Post('test/:id')
  @ApiOperation({ summary: 'Test notification channel' })
  @ApiResponse({ status: 200, description: 'Channel test completed' })
  async testChannel(
    @Param('id') id: string,
    @Body() testData: { recipient: string; message: string },
  ) {
    return this.channelsService.testChannel(id, testData);
  }
}