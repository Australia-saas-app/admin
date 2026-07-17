import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  LessThan,
  MoreThan,
  FindOptionsWhere,
} from 'typeorm';
import { ConstructionService } from '../entities/construction-service.entity';
import { ConstructionCategory } from '../entities/construction-category.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { ServiceQueryDto } from '../dto/query-params.dto';

@Injectable()
export class ConstructionServiceService {
  private readonly logger = new Logger(ConstructionServiceService.name);

  constructor(
    @InjectRepository(ConstructionService)
    private readonly serviceRepository: Repository<ConstructionService>,
    @InjectRepository(ConstructionCategory)
    private readonly categoryRepository: Repository<ConstructionCategory>,
  ) {}

  async create(
    createDto: CreateServiceDto,
    createdBy: string,
  ): Promise<ConstructionService> {
    // Find or create category
    let category = await this.categoryRepository.findOne({
      where: {
        name: createDto.category,
        serviceType: 'construction',
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: createDto.category,
        serviceType: 'construction',
        description: `Category for ${createDto.category} services`,
      });
      category = await this.categoryRepository.save(category);
    }

    // Get max display order
    const maxOrder = await this.serviceRepository.findOne({
      where: { serviceType: 'construction' },
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
      serviceType: 'construction',
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

    const where: any = { serviceType: 'construction' };

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

  async findOne(serviceId: string, isAdmin = false): Promise<ConstructionService> {
    const where: any = { serviceId, serviceType: 'construction' };

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
  ): Promise<ConstructionService> {
    return this.updateWithCriteria(
      { serviceId, serviceType: 'construction' },
      updateDto,
      updatedBy,
      `Service with ID ${serviceId} not found`,
    );
  }

  async updateOwnedService(
    serviceId: string,
    updateDto: UpdateServiceDto,
    ownerId: string,
  ): Promise<ConstructionService> {
    return this.updateWithCriteria(
      { serviceId, serviceType: 'construction', createdBy: ownerId },
      updateDto,
      ownerId,
      'Service not found or access denied',
    );
  }

  async remove(serviceId: string): Promise<void> {
    await this.deleteWithCriteria(
      { serviceId, serviceType: 'construction' },
      `Service with ID ${serviceId} not found`,
    );
  }

  async removeOwnedService(serviceId: string, ownerId: string): Promise<void> {
    await this.deleteWithCriteria(
      { serviceId, serviceType: 'construction', createdBy: ownerId },
      'Service not found or access denied',
    );
  }

  async toggleVisibility(
    serviceId: string,
    isVisible: boolean,
    updatedBy: string,
  ): Promise<ConstructionService> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId, serviceType: 'construction' },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    service.isVisible = isVisible;
    service.updatedBy = updatedBy;

    return await this.serviceRepository.save(service);
  }

  async reorder(serviceId: string, direction: 'up' | 'down'): Promise<ConstructionService> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId, serviceType: 'construction' },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    const query = {
      serviceType: 'construction' as const,
    };

    let swapService: ConstructionService | null = null;

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
    where: FindOptionsWhere<ConstructionService>,
    updateDto: UpdateServiceDto,
    updatedBy: string,
    notFoundMessage: string,
  ): Promise<ConstructionService> {
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
    where: FindOptionsWhere<ConstructionService>,
    notFoundMessage: string,
  ): Promise<void> {
    const service = await this.serviceRepository.findOne({ where });

    if (!service) {
      throw new NotFoundException(notFoundMessage);
    }

    await this.serviceRepository.remove(service);
  }

  private async applyCategoryUpdate(
    service: ConstructionService,
    categoryName?: string,
  ) {
    if (!categoryName || categoryName === service.categoryName) {
      return;
    }

    let category = await this.categoryRepository.findOne({
      where: {
        name: categoryName,
        serviceType: 'construction',
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
        serviceType: 'construction',
        description: `Category for ${categoryName} services`,
      });
      category = await this.categoryRepository.save(category);
    }

    service.categoryId = category.id;
    service.categoryName = category.name;
  }

  private applyServiceUpdates(
    service: ConstructionService,
    updateDto: UpdateServiceDto,
  ) {
    const { category: _, ...updateData } = updateDto;

    if (updateData.title !== undefined) service.title = updateData.title;
    if (updateData.photo !== undefined) service.photo = updateData.photo;
    if (updateData.tag !== undefined) service.tag = updateData.tag;
    if (updateData.description !== undefined)
      service.description = updateData.description;
    if (updateData.displayOrder !== undefined)
      service.displayOrder = updateData.displayOrder;
    if (updateData.isVisible !== undefined)
      service.isVisible = updateData.isVisible;
  }
}


