import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
import { CommercialIndustrialService } from '../entities/commercial-industrial-service.entity';
import { CommercialIndustrialCategory } from '../entities/commercial-industrial-category.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { ServiceQueryDto } from '../dto/query-params.dto';

const SERVICE_TYPE = 'commercial-industrial';

@Injectable()
export class CommercialIndustrialServiceService {
  private readonly logger = new Logger(CommercialIndustrialServiceService.name);

  constructor(
    @InjectRepository(CommercialIndustrialService)
    private readonly serviceRepository: Repository<CommercialIndustrialService>,
    @InjectRepository(CommercialIndustrialCategory)
    private readonly categoryRepository: Repository<CommercialIndustrialCategory>,
  ) {}

  async create(
    createDto: CreateServiceDto,
    createdBy: string,
  ): Promise<CommercialIndustrialService> {
    // Find or create category scoped to this service type
    let category = await this.categoryRepository.findOne({
      where: {
        name: createDto.category,
        serviceType: SERVICE_TYPE,
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: createDto.category,
        serviceType: SERVICE_TYPE,
        description: `Category for ${createDto.category} services`,
      });
      category = await this.categoryRepository.save(category);
    }

    // Get max display order
    const maxOrder = await this.serviceRepository.findOne({
      where: { serviceType: SERVICE_TYPE },
      order: { displayOrder: 'DESC' },
      select: ['displayOrder'],
    });
    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    // Create service entity (exclude category string from DTO)
    const { category: _, ...serviceData } = createDto;

    const service = this.serviceRepository.create({
      title: serviceData.title,
      photo: serviceData.photo,
      tag: serviceData.tag,
      description: serviceData.description,
      serviceType: SERVICE_TYPE,
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

    const where: any = { serviceType: SERVICE_TYPE };

    // Only show visible services for public
    if (!isAdmin) {
      where.isVisible = true;
    } else if (isVisible !== undefined && isVisible !== null) {
      where.isVisible = isVisible === true;
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

  async findOne(
    serviceId: string,
    isAdmin = false,
  ): Promise<CommercialIndustrialService> {
    const where: any = { serviceId, serviceType: SERVICE_TYPE };

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
  ): Promise<CommercialIndustrialService> {
    return this.updateWithCriteria(
      { serviceId, serviceType: SERVICE_TYPE },
      updateDto,
      updatedBy,
      `Service with ID ${serviceId} not found`,
    );
  }

  async updateOwnedService(
    serviceId: string,
    updateDto: UpdateServiceDto,
    ownerId: string,
  ): Promise<CommercialIndustrialService> {
    return this.updateWithCriteria(
      { serviceId, serviceType: SERVICE_TYPE, createdBy: ownerId },
      updateDto,
      ownerId,
      'Service not found or access denied',
    );
  }

  async remove(serviceId: string): Promise<void> {
    await this.deleteWithCriteria(
      { serviceId, serviceType: SERVICE_TYPE },
      `Service with ID ${serviceId} not found`,
    );
  }

  async removeOwnedService(serviceId: string, ownerId: string): Promise<void> {
    await this.deleteWithCriteria(
      { serviceId, serviceType: SERVICE_TYPE, createdBy: ownerId },
      'Service not found or access denied',
    );
  }

  async toggleVisibility(
    serviceId: string,
    isVisible: boolean,
    updatedBy: string,
  ): Promise<CommercialIndustrialService> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId, serviceType: SERVICE_TYPE },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    service.isVisible = isVisible;
    service.updatedBy = updatedBy;

    return await this.serviceRepository.save(service);
  }

  async reorder(
    serviceId: string,
    direction: 'up' | 'down',
  ): Promise<CommercialIndustrialService> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId, serviceType: SERVICE_TYPE },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    const query = {
      serviceType: SERVICE_TYPE,
    };

    let swapService: CommercialIndustrialService | null = null;

    if (direction === 'up') {
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

    const tempOrder = service.displayOrder;
    service.displayOrder = swapService.displayOrder;
    swapService.displayOrder = tempOrder;

    await this.serviceRepository.save(service);
    await this.serviceRepository.save(swapService);

    return service;
  }

  private async updateWithCriteria(
    where: FindOptionsWhere<CommercialIndustrialService>,
    updateDto: UpdateServiceDto,
    updatedBy: string,
    notFoundMessage: string,
  ): Promise<CommercialIndustrialService> {
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
    where: FindOptionsWhere<CommercialIndustrialService>,
    notFoundMessage: string,
  ): Promise<void> {
    const service = await this.serviceRepository.findOne({ where });

    if (!service) {
      throw new NotFoundException(notFoundMessage);
    }

    await this.serviceRepository.remove(service);
  }

  private async applyCategoryUpdate(
    service: CommercialIndustrialService,
    categoryName?: string,
  ) {
    if (!categoryName || categoryName === service.categoryName) {
      return;
    }

    let category = await this.categoryRepository.findOne({
      where: {
        name: categoryName,
        serviceType: SERVICE_TYPE,
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
        serviceType: SERVICE_TYPE,
        description: `Category for ${categoryName} services`,
      });
      category = await this.categoryRepository.save(category);
    }

    service.categoryId = category.id;
    service.categoryName = category.name;
  }

  private applyServiceUpdates(
    service: CommercialIndustrialService,
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

