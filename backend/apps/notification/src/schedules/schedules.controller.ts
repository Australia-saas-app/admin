import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetSchedulesDto } from './dto/get-schedules.dto';

@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.createSchedule(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notification schedules' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully' })
  async getSchedules(@Query() query: GetSchedulesDto) {
    return this.schedulesService.getSchedules(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule retrieved successfully' })
  async getSchedule(@Param('id') id: string) {
    return this.schedulesService.getSchedule(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification schedule' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  async updateSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.updateSchedule(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification schedule' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  async deleteSchedule(@Param('id') id: string) {
    return this.schedulesService.deleteSchedule(id);
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: 'Toggle schedule active status' })
  @ApiResponse({ status: 200, description: 'Schedule status updated successfully' })
  async toggleSchedule(@Param('id') id: string) {
    return this.schedulesService.toggleSchedule(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute schedule manually' })
  @ApiResponse({ status: 200, description: 'Schedule executed successfully' })
  async executeSchedule(@Param('id') id: string) {
    return this.schedulesService.executeSchedule(id);
  }
}