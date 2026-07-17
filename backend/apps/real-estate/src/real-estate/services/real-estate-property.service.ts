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
  LessThan,
  MoreThan,
  FindOptionsWhere,
  Between,
} from 'typeorm';
import { RealEstateProperty } from '../entities/real-estate-property.entity';
import { RealEstateCategory } from '../entities/real-estate-category.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { PropertyQueryDto } from '../dto/query-params.dto';

@Injectable()
export class RealEstatePropertyService {
  private readonly logger = new Logger(RealEstatePropertyService.name);

  constructor(
    @InjectRepository(RealEstateProperty)
    private readonly propertyRepository: Repository<RealEstateProperty>,
    @InjectRepository(RealEstateCategory)
    private readonly categoryRepository: Repository<RealEstateCategory>,
  ) {}

  async create(
    createDto: CreatePropertyDto,
    createdBy: string,
  ): Promise<RealEstateProperty> {
    // Find or create category
    let category = await this.categoryRepository.findOne({
      where: {
        name: createDto.category,
        serviceType: 'real-estate',
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: createDto.category,
        serviceType: 'real-estate',
        description: `Category for ${createDto.category} properties`,
      });
      category = await this.categoryRepository.save(category);
    }

    // Get max display order
    const maxOrder = await this.propertyRepository.findOne({
      where: { serviceType: 'real-estate' },
      order: { displayOrder: 'DESC' },
      select: ['displayOrder'],
    });
    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    // Create property entity
    const { category: _, ...propertyData } = createDto;
    
    const property = this.propertyRepository.create({
      propertyType: propertyData.propertyType,
      propertyStatus: propertyData.propertyStatus,
      currentStatus: propertyData.currentStatus,
      photos: propertyData.photos || [],
      description: propertyData.description,
      sizeSquareFeet: propertyData.sizeSquareFeet,
      price: propertyData.price,
      features: propertyData.features || [],
      beds: propertyData.beds,
      bathroom: propertyData.bathroom,
      kitchen: propertyData.kitchen,
      serviceType: 'real-estate',
      categoryId: category.id,
      categoryName: category.name,
      displayOrder: createDto.displayOrder ?? displayOrder,
      isVisible: createDto.isVisible ?? true,
      createdBy,
      updatedBy: createdBy,
    });

    return await this.propertyRepository.save(property);
  }

  async findAll(query: PropertyQueryDto, isAdmin = false) {
    const {
      page = 1,
      limit = 10,
      propertyType,
      propertyStatus,
      minPrice,
      maxPrice,
      isVisible,
      category,
    } = query;
    const skip = (page - 1) * limit;

    // Normalize empty strings to undefined
    const normalizedPropertyType = propertyType && typeof propertyType === 'string' && propertyType.trim() !== '' ? propertyType.trim() : undefined;
    const normalizedPropertyStatus = propertyStatus && typeof propertyStatus === 'string' && propertyStatus.trim() !== '' ? propertyStatus.trim() : undefined;
    const normalizedCategory = category && typeof category === 'string' && category.trim() !== '' ? category.trim() : undefined;
    
    // Price normalization: handle NaN, null, undefined (0 is a valid price for free properties)
    const normalizedMinPrice = (minPrice !== undefined && minPrice !== null && typeof minPrice === 'number' && !isNaN(minPrice)) ? minPrice : undefined;
    const normalizedMaxPrice = (maxPrice !== undefined && maxPrice !== null && typeof maxPrice === 'number' && !isNaN(maxPrice)) ? maxPrice : undefined;

    const where: any = { serviceType: 'real-estate' };

    // Only show visible properties for public
    if (!isAdmin) {
      where.isVisible = true;
    } else {
      // For admin: only filter by visibility if explicitly provided
      if (isVisible !== undefined && isVisible !== null) {
        where.isVisible = isVisible === true;
      }
    }

    // Category filter
    if (normalizedCategory) {
      where.categoryName = normalizedCategory;
    }

    // Property type filter
    if (normalizedPropertyType) {
      where.propertyType = normalizedPropertyType;
    }

    // Property status filter
    if (normalizedPropertyStatus) {
      where.propertyStatus = normalizedPropertyStatus;
    }

    // Price range filter - only apply if values are actually numbers
    if (normalizedMinPrice !== undefined) {
      if (normalizedMaxPrice !== undefined) {
        where.price = Between(normalizedMinPrice, normalizedMaxPrice);
      } else {
        where.price = MoreThan(normalizedMinPrice);
      }
    } else if (normalizedMaxPrice !== undefined) {
      where.price = LessThan(normalizedMaxPrice);
    }

    // Debug: Log the where clause (using console.log to ensure it shows in pino logs)
    console.log(`[findAll] Raw query params: minPrice=${minPrice} (type: ${typeof minPrice}), maxPrice=${maxPrice} (type: ${typeof maxPrice})`);
    console.log(`[findAll] Normalized prices: minPrice=${normalizedMinPrice}, maxPrice=${normalizedMaxPrice}`);
    console.log(`[findAll] Where clause: ${JSON.stringify(where)}`);
    console.log(`[findAll] Normalized values: propertyStatus=${normalizedPropertyStatus}, propertyType=${normalizedPropertyType}, category=${normalizedCategory}`);
    console.log(`[findAll] Query params: page=${page}, limit=${limit}, isAdmin=${isAdmin}, isVisible=${isVisible}`);

    const [properties, total] = await this.propertyRepository.findAndCount({
      where,
      relations: ['category'],
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
      skip,
      take: limit,
    });

    console.log(`[findAll] Found ${total} properties matching the query`);
    
    // Also log a count of all properties in the database for debugging
    const allPropertiesCount = await this.propertyRepository.count({
      where: { serviceType: 'real-estate' },
    });
    console.log(`[findAll] Total properties in database: ${allPropertiesCount}`);
    
    // Log sample properties for debugging (first 3)
    if (allPropertiesCount > 0) {
      const sampleProperties = await this.propertyRepository.find({
        where: { serviceType: 'real-estate' },
        select: ['propertyId', 'propertyType', 'propertyStatus', 'isVisible', 'categoryName'],
        take: 3,
      });
      console.log(`[findAll] Sample properties: ${JSON.stringify(sampleProperties, null, 2)}`);
    }

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(propertyId: string, isAdmin = false): Promise<RealEstateProperty> {
    const where: any = { propertyId, serviceType: 'real-estate' };

    if (!isAdmin) {
      where.isVisible = true;
    }

    const property = await this.propertyRepository.findOne({
      where,
      relations: ['category'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return property;
  }

  async update(
    propertyId: string,
    updateDto: UpdatePropertyDto,
    updatedBy: string,
  ): Promise<RealEstateProperty> {
    return this.updateWithCriteria(
      { propertyId, serviceType: 'real-estate' },
      updateDto,
      updatedBy,
      `Property with ID ${propertyId} not found`,
    );
  }

  async updateOwnedProperty(
    propertyId: string,
    updateDto: UpdatePropertyDto,
    ownerId: string,
  ): Promise<RealEstateProperty> {
    return this.updateWithCriteria(
      { propertyId, serviceType: 'real-estate', createdBy: ownerId },
      updateDto,
      ownerId,
      'Property not found or access denied',
    );
  }

  async remove(propertyId: string): Promise<void> {
    await this.deleteWithCriteria(
      { propertyId, serviceType: 'real-estate' },
      `Property with ID ${propertyId} not found`,
    );
  }

  async removeOwnedProperty(propertyId: string, ownerId: string): Promise<void> {
    await this.deleteWithCriteria(
      { propertyId, serviceType: 'real-estate', createdBy: ownerId },
      'Property not found or access denied',
    );
  }

  async toggleVisibility(
    propertyId: string,
    isVisible: boolean,
    updatedBy: string,
  ): Promise<RealEstateProperty> {
    const property = await this.propertyRepository.findOne({
      where: { propertyId, serviceType: 'real-estate' },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    property.isVisible = isVisible;
    property.updatedBy = updatedBy;

    return await this.propertyRepository.save(property);
  }

  async reorder(propertyId: string, direction: 'up' | 'down'): Promise<RealEstateProperty> {
    const property = await this.propertyRepository.findOne({
      where: { propertyId, serviceType: 'real-estate' },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    const query = {
      serviceType: 'real-estate' as const,
    };

    let swapProperty: RealEstateProperty | null = null;

    if (direction === 'up') {
      // Find property with lower displayOrder
      swapProperty = await this.propertyRepository.findOne({
        where: {
          ...query,
          displayOrder: LessThan(property.displayOrder),
        },
        order: { displayOrder: 'DESC' },
      });

      if (!swapProperty) {
        throw new BadRequestException('Property is already at the top');
      }
    } else {
      // Find property with higher displayOrder
      swapProperty = await this.propertyRepository.findOne({
        where: {
          ...query,
          displayOrder: MoreThan(property.displayOrder),
        },
        order: { displayOrder: 'ASC' },
      });

      if (!swapProperty) {
        throw new BadRequestException('Property is already at the bottom');
      }
    }

    // Swap display orders
    const tempOrder = property.displayOrder;
    property.displayOrder = swapProperty.displayOrder;
    swapProperty.displayOrder = tempOrder;

    await this.propertyRepository.save(property);
    await this.propertyRepository.save(swapProperty);

    return property;
  }

  private async updateWithCriteria(
    where: FindOptionsWhere<RealEstateProperty>,
    updateDto: UpdatePropertyDto,
    updatedBy: string,
    notFoundMessage: string,
  ): Promise<RealEstateProperty> {
    const property = await this.propertyRepository.findOne({ where });

    if (!property) {
      throw new NotFoundException(notFoundMessage);
    }

    await this.applyCategoryUpdate(property, updateDto.category);
    this.applyPropertyUpdates(property, updateDto);

    property.updatedBy = updatedBy;
    property.updatedAt = new Date();

    return this.propertyRepository.save(property);
  }

  private async deleteWithCriteria(
    where: FindOptionsWhere<RealEstateProperty>,
    notFoundMessage: string,
  ): Promise<void> {
    const property = await this.propertyRepository.findOne({ where });

    if (!property) {
      throw new NotFoundException(notFoundMessage);
    }

    await this.propertyRepository.remove(property);
  }

  private async applyCategoryUpdate(
    property: RealEstateProperty,
    categoryName?: string,
  ) {
    if (!categoryName || categoryName === property.categoryName) {
      return;
    }

    let category = await this.categoryRepository.findOne({
      where: {
        name: categoryName,
        serviceType: 'real-estate',
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
        serviceType: 'real-estate',
        description: `Category for ${categoryName} properties`,
      });
      category = await this.categoryRepository.save(category);
    }

    property.categoryId = category.id;
    property.categoryName = category.name;
  }

  private applyPropertyUpdates(
    property: RealEstateProperty,
    updateDto: UpdatePropertyDto,
  ) {
    const { category: _, ...updateData } = updateDto;

    if (updateData.propertyType !== undefined) property.propertyType = updateData.propertyType;
    if (updateData.propertyStatus !== undefined) property.propertyStatus = updateData.propertyStatus;
    if (updateData.currentStatus !== undefined) property.currentStatus = updateData.currentStatus;
    if (updateData.photos !== undefined) property.photos = updateData.photos;
    if (updateData.description !== undefined) property.description = updateData.description;
    if (updateData.sizeSquareFeet !== undefined) property.sizeSquareFeet = updateData.sizeSquareFeet;
    if (updateData.price !== undefined) property.price = updateData.price;
    if (updateData.features !== undefined) property.features = updateData.features;
    if (updateData.beds !== undefined) property.beds = updateData.beds;
    if (updateData.bathroom !== undefined) property.bathroom = updateData.bathroom;
    if (updateData.kitchen !== undefined) property.kitchen = updateData.kitchen;
    if (updateData.displayOrder !== undefined) property.displayOrder = updateData.displayOrder;
    if (updateData.isVisible !== undefined) property.isVisible = updateData.isVisible;
  }
}

