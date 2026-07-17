import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { EducationCategory } from "../entities/education-category.entity";
import { Course } from "../entities/course.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { CategoryQueryDto } from "../dto/query-params.dto";

@Injectable()
export class EducationCategoryService {
  private readonly logger = new Logger(EducationCategoryService.name);

  constructor(
    @InjectRepository(EducationCategory)
    private readonly categoryRepository: Repository<EducationCategory>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<EducationCategory> {
    // Check if category already exists
    const existing = await this.categoryRepository.findOne({
      where: {
        name: createDto.name,
        serviceType: "education",
      },
    });

    if (existing) {
      throw new ConflictException(
        `Category "${createDto.name}" already exists for education courses`,
      );
    }

    // Get max display order
    const maxOrder = await this.categoryRepository.findOne({
      where: { serviceType: "education" },
      order: { displayOrder: "DESC" },
      select: ["displayOrder"],
    });
    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    const category = this.categoryRepository.create({
      ...createDto,
      serviceType: "education",
      displayOrder: createDto.displayOrder ?? displayOrder,
      isActive: createDto.isActive ?? true,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(query: CategoryQueryDto) {
    const {
      page = 1,
      limit = 50,
      search,
      isActive,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { serviceType: "education" };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Search filter
    if (search && search.trim() !== "") {
      where.name = Like(`%${search}%`);
    }

    const order: any = {};
    order[sortBy] = sortOrder;

    const [categories, total] = await this.categoryRepository.findAndCount({
      where,
      order,
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

  async findOne(categoryId: string): Promise<EducationCategory> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: "education" },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }

  async update(
    categoryId: string,
    updateDto: UpdateCategoryDto,
  ): Promise<EducationCategory> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: "education" },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Check for name conflict if updating name
    if (updateDto.name && updateDto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: {
          name: updateDto.name,
          serviceType: "education",
        },
      });

      if (existing) {
        throw new ConflictException(
          `Category "${updateDto.name}" already exists for education courses`,
        );
      }
    }

    Object.assign(category, updateDto);
    return await this.categoryRepository.save(category);
  }

  async remove(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, serviceType: "education" },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Check if category is in use
    const coursesCount = await this.courseRepository.count({
      where: { categoryId: category.id },
    });

    if (coursesCount > 0) {
      throw new BadRequestException(
        "Cannot delete category that is being used by courses",
      );
    }

    await this.categoryRepository.remove(category);
  }
}
