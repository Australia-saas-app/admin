import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommercialIndustrialCategory } from '../entities/commercial-industrial-category.entity';
import { CommercialIndustrialService } from '../entities/commercial-industrial-service.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryQueryDto } from '../dto/query-params.dto';

const SERVICE_TYPE = 'commercial-industrial';

@Injectable()
export class CommercialIndustrialCategoryService {
  private readonly logger = new Logger(CommercialIndustrialCategoryService.name);

  constructor(
    @InjectRepository(CommercialIndustrialCategory)
    private readonly categoryRepository: Repository<CommercialIndustrialCategory>,
    @InjectRepository(CommercialIndustrialService)
    private readonly serviceRepository: Repository<CommercialIndustrialService>,
  ) {}

  async create(
    createDto: CreateCategoryDto,
  ): Promise<CommercialIndustrialCategory> {
    // Check if category already exists
    const existing = await this.categoryRepository.findOne({
      where: {
        name: createDto.name,
        serviceType: SERVICE_TYPE,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Category "${createDto.name}" already exists for commercial & industrial services`,
      );
    }

    // Get max display order
    const maxOrder = await this.categoryRepository.findOne({
      where: { serviceType: SERVICE_TYPE },
      order: { displayOrder: 'DESC' },
      select: ['displayOrder'],
    });
    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    const category = this.categoryRepository.create({
      ...createDto,
      serviceType: SERVICE_TYPE,
      displayOrder: createDto.displayOrder ?? displayOrder,
      isActive: createDto.isActive ?? true,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(query: CategoryQueryDto) {
    const { page = 1, limit = 50, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = { serviceType: SERVICE_TYPE };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [categories, total] = await this.categoryRepository.findAndCount({
      where,
      order: { displayOrder: 'ASC', name: 'ASC' },
      skip,
      take: limit,
    });

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(
    categoryId: string,
  ): Promise<CommercialIndustrialCategory> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: SERVICE_TYPE },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }

  async update(
    categoryId: string,
    updateDto: UpdateCategoryDto,
  ): Promise<CommercialIndustrialCategory> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: SERVICE_TYPE },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Check if name is being changed and conflicts with existing
    if (updateDto.name && updateDto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: {
          name: updateDto.name,
          serviceType: SERVICE_TYPE,
        },
      });

      if (existing && existing.categoryId !== categoryId) {
        throw new ConflictException(
          `Category "${updateDto.name}" already exists`,
        );
      }
    }

    Object.assign(category, updateDto);

    return await this.categoryRepository.save(category);
  }

  async remove(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: SERVICE_TYPE },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Check if any services are using this category
    const servicesCount = await this.serviceRepository.count({
      where: { categoryId: category.id },
    });

    if (servicesCount > 0) {
      throw new BadRequestException(
        `Cannot delete category. ${servicesCount} service(s) are using it.`,
      );
    }

    await this.categoryRepository.remove(category);
  }
}

