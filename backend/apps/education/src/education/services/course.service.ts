import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, FindOptionsWhere } from "typeorm";
import { Course } from "../entities/course.entity";
import { EducationCategory } from "../entities/education-category.entity";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseDto } from "../dto/update-course.dto";
import { CourseQueryDto } from "../dto/query-params.dto";

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(EducationCategory)
    private readonly categoryRepository: Repository<EducationCategory>,
  ) {}

  async create(createDto: CreateCourseDto, createdBy: string): Promise<Course> {
    // Find or create category
    let category = await this.categoryRepository.findOne({
      where: {
        name: createDto.category,
        serviceType: "education",
      },
    });

    if (!category) {
      category = this.categoryRepository.create({
        name: createDto.category,
        serviceType: "education",
        description: `Category for ${createDto.category} courses`,
      });
      category = await this.categoryRepository.save(category);
    }

    // Get max display order
    const maxOrder = await this.courseRepository.findOne({
      where: { serviceType: "education" },
      order: { displayOrder: "DESC" },
      select: ["displayOrder"],
    });
    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    // Create course entity
    const course = this.courseRepository.create({
      title: createDto.title,
      description: createDto.description,
      thumbnail: createDto.thumbnail,
      tag: createDto.tag,
      serviceType: "education",
       categoryId: category.id,
       categoryName: category.name,
       instructorId: createDto.instructorId,
       price: createDto.price ?? 0,
       currency: createDto.currency ?? "USD",
       durationHours: createDto.durationHours,
       videoUrls: createDto.videoUrls,
       displayOrder: createDto.displayOrder ?? displayOrder,
       isVisible: createDto.isVisible ?? true,
      createdBy,
      updatedBy: createdBy,
    });

    return await this.courseRepository.save(course);
  }

  async findAll(query: CourseQueryDto, isAdmin = false) {
    const {
      page = 1,
      limit = 10,
      search,
      isVisible,
      categoryId,
      instructorId,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { serviceType: "education" };

    // Only show visible courses for public
    if (!isAdmin) {
      where.isVisible = true;
    } else {
      if (isVisible !== undefined && isVisible !== null) {
        where.isVisible = isVisible === true;
      }
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Instructor filter
    if (instructorId) {
      where.instructorId = instructorId;
    }

    // Search filter
    if (search && search.trim() !== "") {
      where.title = Like(`%${search}%`);
    }

    const order: any = {};
    order[sortBy] = sortOrder;

    const [courses, total] = await this.courseRepository.findAndCount({
      where,
      relations: ["category"],
      order,
      skip,
      take: limit,
    });

    return {
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(courseId: string, isAdmin = false): Promise<Course> {
    const where: any = { courseId, serviceType: "education" };

    if (!isAdmin) {
      where.isVisible = true;
    }

    const course = await this.courseRepository.findOne({
      where,
      relations: ["category"],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return course;
  }

  async update(
    courseId: string,
    updateDto: UpdateCourseDto,
    updatedBy: string,
  ): Promise<Course> {
    return this.updateWithCriteria(
      { courseId, serviceType: "education" },
      updateDto,
      updatedBy,
      `Course with ID ${courseId} not found`,
    );
  }

  async updateOwnedCourse(
    courseId: string,
    updateDto: UpdateCourseDto,
    ownerId: string,
  ): Promise<Course> {
    return this.updateWithCriteria(
      { courseId, serviceType: "education", createdBy: ownerId },
      updateDto,
      ownerId,
      "Course not found or access denied",
    );
  }

  async remove(courseId: string): Promise<void> {
    await this.deleteWithCriteria(
      { courseId, serviceType: "education" },
      `Course with ID ${courseId} not found`,
    );
  }

  async removeOwnedCourse(courseId: string, ownerId: string): Promise<void> {
    await this.deleteWithCriteria(
      { courseId, serviceType: "education", createdBy: ownerId },
      "Course not found or access denied",
    );
  }

  async toggleVisibility(
    courseId: string,
    isVisible: boolean,
    updatedBy: string,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { courseId, serviceType: "education" },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    course.isVisible = isVisible;
    course.updatedBy = updatedBy;
    course.updatedAt = new Date();

    return await this.courseRepository.save(course);
  }

  async reorder(courseId: string, direction: "up" | "down"): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { courseId, serviceType: "education" },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const adjacentOrder =
      direction === "up" ? course.displayOrder - 1 : course.displayOrder + 1;

    const adjacentCourse = await this.courseRepository.findOne({
      where: {
        displayOrder: adjacentOrder,
        serviceType: "education",
      },
    });

    if (!adjacentCourse) {
      throw new BadRequestException(`Cannot reorder: no adjacent course found`);
    }

    // Swap display orders
    const tempOrder = course.displayOrder;
    course.displayOrder = adjacentCourse.displayOrder;
    adjacentCourse.displayOrder = tempOrder;

    await this.courseRepository.save(course);
    await this.courseRepository.save(adjacentCourse);

    return course;
  }

  private async updateWithCriteria(
    criteria: FindOptionsWhere<Course>,
    updateDto: UpdateCourseDto,
    updatedBy: string,
    notFoundMessage: string,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: criteria,
      relations: ["category"],
    });

    if (!course) {
      throw new NotFoundException(notFoundMessage);
    }

    // Handle category update
    if (updateDto.category) {
      let category = await this.categoryRepository.findOne({
        where: {
          name: updateDto.category,
          serviceType: "education",
        },
      });

      if (!category) {
        category = this.categoryRepository.create({
          name: updateDto.category,
          serviceType: "education",
          description: `Category for ${updateDto.category} courses`,
        });
        category = await this.categoryRepository.save(category);
      }

      course.categoryId = category.id;
      course.categoryName = category.name;
    }

    // Update other fields
    Object.assign(course, {
      ...updateDto,
      updatedBy,
      updatedAt: new Date(),
    });

    return await this.courseRepository.save(course);
  }

  private async deleteWithCriteria(
    criteria: FindOptionsWhere<Course>,
    notFoundMessage: string,
  ): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: criteria,
    });

    if (!course) {
      throw new NotFoundException(notFoundMessage);
    }

    await this.courseRepository.remove(course);
  }
}
