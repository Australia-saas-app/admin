import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationChannel } from '../entities/notification-channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(NotificationChannel)
    private readonly channelRepository: Repository<NotificationChannel>,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto) {
    const channel = this.channelRepository.create({
      ...createChannelDto,
      isActive: createChannelDto.isActive ?? true,
    });

    const savedChannel = await this.channelRepository.save(channel);

    return {
      success: true,
      data: savedChannel,
    };
  }

  async getChannels() {
    const channels = await this.channelRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      data: channels,
    };
  }

  async getChannel(id: string) {
    const channel = await this.channelRepository.findOne({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return {
      success: true,
      data: channel,
    };
  }

  async updateChannel(id: string, updateChannelDto: UpdateChannelDto) {
    const channel = await this.channelRepository.findOne({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    Object.assign(channel, updateChannelDto);
    const updatedChannel = await this.channelRepository.save(channel);

    return {
      success: true,
      data: updatedChannel,
    };
  }

  async deleteChannel(id: string) {
    const channel = await this.channelRepository.findOne({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    await this.channelRepository.remove(channel);

    return {
      success: true,
      message: 'Channel deleted successfully',
    };
  }

  async toggleChannel(id: string) {
    const channel = await this.channelRepository.findOne({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    channel.isActive = !channel.isActive;
    const updatedChannel = await this.channelRepository.save(channel);

    return {
      success: true,
      data: updatedChannel,
      message: `Channel ${channel.isActive ? 'activated' : 'deactivated'} successfully`,
    };
  }

  async testChannel(id: string, testData: { recipient: string; message: string }) {
    const channel = await this.channelRepository.findOne({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (!channel.isActive) {
      return {
        success: false,
        message: 'Channel is not active',
      };
    }

    // Here you would implement actual channel testing logic
    // For now, return a placeholder response
    return {
      success: true,
      message: `Test notification sent via ${channel.name} channel`,
      data: {
        channel: channel.name,
        recipient: testData.recipient,
        status: 'sent',
      },
    };
  }
}