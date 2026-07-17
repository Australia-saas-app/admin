import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/notification-template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { GetTemplatesDto } from './dto/get-templates.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(NotificationTemplate)
    private readonly templateRepository: Repository<NotificationTemplate>,
  ) {}

  async createTemplate(createTemplateDto: CreateTemplateDto) {
    const template = this.templateRepository.create({
      ...createTemplateDto,
      isActive: createTemplateDto.isActive ?? true,
    });

    const savedTemplate = await this.templateRepository.save(template);

    return {
      success: true,
      data: savedTemplate,
    };
  }

  async getTemplates(query: GetTemplatesDto) {
    const { type, isActive, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    // Apply filters
    if (type) {
      queryBuilder.andWhere('template.type = :type', { type });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('template.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(template.name ILIKE :search OR template.type ILIKE :search OR template.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`template.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [templates, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: {
        templates,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getTemplate(id: string) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return {
      success: true,
      data: template,
    };
  }

  async updateTemplate(id: string, updateTemplateDto: UpdateTemplateDto) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    Object.assign(template, updateTemplateDto);
    const updatedTemplate = await this.templateRepository.save(template);

    return {
      success: true,
      data: updatedTemplate,
    };
  }

  async deleteTemplate(id: string) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.templateRepository.remove(template);

    return {
      success: true,
      message: 'Template deleted successfully',
    };
  }

  async toggleTemplate(id: string) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    template.isActive = !template.isActive;
    const updatedTemplate = await this.templateRepository.save(template);

    return {
      success: true,
      data: updatedTemplate,
      message: `Template ${template.isActive ? 'activated' : 'deactivated'} successfully`,
    };
  }

  async previewTemplate(id: string, sampleData: any) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Simple template rendering (you might want to use a proper template engine like Handlebars)
    let renderedContent = template.content;
    let renderedSubject = template.subject;

    // Replace variables in content and subject
    Object.keys(sampleData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      renderedContent = renderedContent.replace(regex, sampleData[key]);
      renderedSubject = renderedSubject.replace(regex, sampleData[key]);
    });

    return {
      success: true,
      data: {
        templateId: template.id,
        type: template.type,
        subject: renderedSubject,
        content: renderedContent,
        sampleData,
      },
    };
  }

  async getTemplateTypes() {
    // Get distinct template types
    const types = await this.templateRepository
      .createQueryBuilder('template')
      .select('template.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('template.isActive = :isActive', { isActive: true })
      .groupBy('template.type')
      .getRawMany();

    // Common notification types
    const commonTypes = [
      'welcome',
      'order_confirmation',
      'password_reset',
      'account_verification',
      'payment_success',
      'payment_failed',
      'order_shipped',
      'order_delivered',
      'promotion',
      'security_alert',
      'system_maintenance',
    ];

    return {
      success: true,
      data: {
        availableTypes: commonTypes,
        existingTypes: types,
      },
    };
  }
}