import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RealEstateCategory } from '../entities/real-estate-category.entity';
import { RealEstateProperty } from '../entities/real-estate-property.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryQueryDto } from '../dto/query-params.dto';

@Injectable()
export class RealEstateCategoryService {
  private readonly logger = new Logger(RealEstateCategoryService.name);

  constructor(
    @InjectRepository(RealEstateCategory)
    private readonly categoryRepository: Repository<RealEstateCategory>,
    @InjectRepository(RealEstateProperty)
    private readonly propertyRepository: Repository<RealEstateProperty>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<RealEstateCategory> {
    // Check if category already exists
    const existing = await this.categoryRepository.findOne({
      where: {
        name: createDto.name,
        serviceType: 'real-estate',
      },
    });

    if (existing) {
      throw new ConflictException(
        `Category "${createDto.name}" already exists for real estate properties`,
      );
    }

    // Get max display order
    const maxOrder = await this.categoryRepository.findOne({
      where: { serviceType: 'real-estate' },
      order: { displayOrder: 'DESC' },
      select: ['displayOrder'],
    });
    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    const category = this.categoryRepository.create({
      ...createDto,
      serviceType: 'real-estate',
      displayOrder: createDto.displayOrder ?? displayOrder,
      isActive: createDto.isActive ?? true,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(query: CategoryQueryDto) {
    const { page = 1, limit = 50, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = { serviceType: 'real-estate' };

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

  async findOne(categoryId: string): Promise<RealEstateCategory> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: 'real-estate' },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }

  async update(
    categoryId: string,
    updateDto: UpdateCategoryDto,
  ): Promise<RealEstateCategory> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: 'real-estate' },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Check if name is being changed and conflicts with existing
    if (updateDto.name && updateDto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: {
          name: updateDto.name,
          serviceType: 'real-estate',
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
      where: { categoryId, serviceType: 'real-estate' },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Check if any properties are using this category
    const propertiesCount = await this.propertyRepository.count({
      where: { categoryId: category.id },
    });

    if (propertiesCount > 0) {
      throw new BadRequestException(
        `Cannot delete category. ${propertiesCount} property(ies) are using it.`,
      );
    }

    await this.categoryRepository.remove(category);
  }
}


