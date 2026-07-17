import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, LessThan, MoreThan, FindOptionsWhere } from 'typeorm';
import { TechnicalService } from '../entities/technical-service.entity';
import { TechnicalCategory } from '../entities/technical-category.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { ServiceQueryDto } from '../dto/query-params.dto';

@Injectable()
export class TechnicalServiceService {
  private readonly logger = new Logger(TechnicalServiceService.name);

  constructor(
    @InjectRepository(TechnicalService)
    private readonly serviceRepository: Repository<TechnicalService>,
    @InjectRepository(TechnicalCategory)
    private readonly categoryRepository: Repository<TechnicalCategory>,
  ) {}

  async create(createDto: CreateServiceDto, createdBy: string): Promise<TechnicalService> {
    // Find or create category
    let category = await this.categoryRepository.findOne({
      where: {
        name: createDto.category,
        serviceType: 'technical',
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: createDto.category,
        serviceType: 'technical',
        description: `Category for ${createDto.category} services`,
      });
      category = await this.categoryRepository.save(category);
    }

    // Get max display order
    const maxOrder = await this.serviceRepository.findOne({
      where: { serviceType: 'technical' },
      order: { displayOrder: 'DESC' },
      select: ['displayOrder'],
    });
    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    // Create service entity (exclude category from DTO as it's a string, we use categoryId)
    const { category: _, ...serviceData } = createDto;

    const service = this.serviceRepository.create({
      title: serviceData.title,
      photo: serviceData.photo,
      tag: serviceData.tag,
      description: serviceData.description,
      serviceType: 'technical',
      categoryId: category.id,
      categoryName: category.name,
      displayOrder: createDto.displayOrder ?? displayOrder,
      isVisible: createDto.isVisible ?? true,
      createdBy,
      updatedBy: createdBy,
    });

    return await this.serviceRepository.save(service);
  }

  async findAll(query: ServiceQueryDto, isAdmin = false) {
    const { page = 1, limit = 10, search, isVisible, category } = query;
    const skip = (page - 1) * limit;

    const where: any = { serviceType: 'technical' };

    // Only show visible services for public
    if (!isAdmin) {
      where.isVisible = true;
    } else {
      // For admin: only filter by visibility if explicitly provided (not empty string converted to undefined)
      // Empty string in query should result in undefined after Transform, showing all services
      if (isVisible !== undefined && isVisible !== null) {
        // Explicitly provided as boolean true/false
        where.isVisible = isVisible === true;
      }
      // If isVisible is undefined (from empty string), don't filter - show all services
    }

    // Category filter (only if not empty string)
    if (category && category.trim() !== '') {
      where.categoryName = category;
    }

    // Search filter (only if not empty string)
    if (search && search.trim() !== '') {
      where.title = Like(`%${search}%`);
    }

    // User ID filter (creator)
    if (query.userId && query.userId.trim() !== '') {
      where.createdBy = query.userId;
    }

    const [services, total] = await this.serviceRepository.findAndCount({
      where,
      relations: ['category'],
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(serviceId: string, isAdmin = false): Promise<TechnicalService> {
    const where: any = { serviceId, serviceType: 'technical' };

    if (!isAdmin) {
      where.isVisible = true;
    }

    const service = await this.serviceRepository.findOne({
      where,
      relations: ['category'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    return service;
  }

  async update(
    serviceId: string,
    updateDto: UpdateServiceDto,
    updatedBy: string,
  ): Promise<TechnicalService> {
    return this.updateWithCriteria(
      { serviceId, serviceType: 'technical' },
      updateDto,
      updatedBy,
      `Service with ID ${serviceId} not found`,
    );
  }

  async updateOwnedService(
    serviceId: string,
    updateDto: UpdateServiceDto,
    ownerId: string,
  ): Promise<TechnicalService> {
    return this.updateWithCriteria(
      { serviceId, serviceType: 'technical', createdBy: ownerId },
      updateDto,
      ownerId,
      'Service not found or access denied',
    );
  }

  async remove(serviceId: string): Promise<void> {
    await this.deleteWithCriteria(
      { serviceId, serviceType: 'technical' },
      `Service with ID ${serviceId} not found`,
    );
  }

  async removeOwnedService(serviceId: string, ownerId: string): Promise<void> {
    await this.deleteWithCriteria(
      { serviceId, serviceType: 'technical', createdBy: ownerId },
      'Service not found or access denied',
    );
  }

  async toggleVisibility(
    serviceId: string,
    isVisible: boolean,
    updatedBy: string,
  ): Promise<TechnicalService> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId, serviceType: 'technical' },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    service.isVisible = isVisible;
    service.updatedBy = updatedBy;

    return await this.serviceRepository.save(service);
  }

  async reorder(serviceId: string, direction: 'up' | 'down'): Promise<TechnicalService> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId, serviceType: 'technical' },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    const query = {
      serviceType: 'technical' as const,
    };

    let swapService: TechnicalService | null = null;

    if (direction === 'up') {
      // Find service with lower displayOrder
      swapService = await this.serviceRepository.findOne({
        where: {
          ...query,
          displayOrder: LessThan(service.displayOrder),
        },
        order: { displayOrder: 'DESC' },
      });

      if (!swapService) {
        throw new BadRequestException('Service is already at the top');
      }
    } else {
      // Find service with higher displayOrder
      swapService = await this.serviceRepository.findOne({
        where: {
          ...query,
          displayOrder: MoreThan(service.displayOrder),
        },
        order: { displayOrder: 'ASC' },
      });

      if (!swapService) {
        throw new BadRequestException('Service is already at the bottom');
      }
    }

    // Swap display orders
    const tempOrder = service.displayOrder;
    service.displayOrder = swapService.displayOrder;
    swapService.displayOrder = tempOrder;

    await this.serviceRepository.save(service);
    await this.serviceRepository.save(swapService);

    return service;
  }

  private async updateWithCriteria(
    where: FindOptionsWhere<TechnicalService>,
    updateDto: UpdateServiceDto,
    updatedBy: string,
    notFoundMessage: string,
  ): Promise<TechnicalService> {
    const service = await this.serviceRepository.findOne({ where });

    if (!service) {
      throw new NotFoundException(notFoundMessage);
    }

    await this.applyCategoryUpdate(service, updateDto.category);
    this.applyServiceUpdates(service, updateDto);

    service.updatedBy = updatedBy;
    service.updatedAt = new Date();

    return this.serviceRepository.save(service);
  }

  private async deleteWithCriteria(
    where: FindOptionsWhere<TechnicalService>,
    notFoundMessage: string,
  ): Promise<void> {
    const service = await this.serviceRepository.findOne({ where });

    if (!service) {
      throw new NotFoundException(notFoundMessage);
    }

    await this.serviceRepository.remove(service);
  }

  private async applyCategoryUpdate(service: TechnicalService, categoryName?: string) {
    if (!categoryName || categoryName === service.categoryName) {
      return;
    }

    let category = await this.categoryRepository.findOne({
      where: {
        name: categoryName,
        serviceType: 'technical',
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
        serviceType: 'technical',
        description: `Category for ${categoryName} services`,
      });
      category = await this.categoryRepository.save(category);
    }

    service.categoryId = category.id;
    service.categoryName = category.name;
  }

  private applyServiceUpdates(service: TechnicalService, updateDto: UpdateServiceDto) {
    const { category: _, ...updateData } = updateDto;

    if (updateData.title !== undefined) service.title = updateData.title;
    if (updateData.photo !== undefined) service.photo = updateData.photo;
    if (updateData.tag !== undefined) service.tag = updateData.tag;
    if (updateData.description !== undefined) service.description = updateData.description;
    if (updateData.displayOrder !== undefined) service.displayOrder = updateData.displayOrder;
    if (updateData.isVisible !== undefined) service.isVisible = updateData.isVisible;
  }
}
