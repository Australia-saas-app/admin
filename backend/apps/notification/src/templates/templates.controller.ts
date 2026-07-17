import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { GetTemplatesDto } from './dto/get-templates.dto';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.createTemplate(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notification templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async getTemplates(@Query() query: GetTemplatesDto) {
    return this.templatesService.getTemplates(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  async getTemplate(@Param('id') id: string) {
    return this.templatesService.getTemplate(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  async updateTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templatesService.updateTemplate(id, updateTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification template' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  async deleteTemplate(@Param('id') id: string) {
    return this.templatesService.deleteTemplate(id);
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: 'Toggle template active status' })
  @ApiResponse({ status: 200, description: 'Template status updated successfully' })
  async toggleTemplate(@Param('id') id: string) {
    return this.templatesService.toggleTemplate(id);
  }

  @Post(':id/preview')
  @ApiOperation({ summary: 'Preview template with sample data' })
  @ApiResponse({ status: 200, description: 'Template preview generated' })
  async previewTemplate(
    @Param('id') id: string,
    @Body() sampleData: any,
  ) {
    return this.templatesService.previewTemplate(id, sampleData);
  }

  @Get('types/list')
  @ApiOperation({ summary: 'Get available template types' })
  @ApiResponse({ status: 200, description: 'Template types retrieved' })
  async getTemplateTypes() {
    return this.templatesService.getTemplateTypes();
  }
}