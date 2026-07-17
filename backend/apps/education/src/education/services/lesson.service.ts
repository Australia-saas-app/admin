import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Lesson } from "../entities/lesson.entity";
import { Course } from "../entities/course.entity";
import { CreateLessonDto } from "../dto/create-lesson.dto";
import { UpdateLessonDto } from "../dto/update-lesson.dto";
import { LessonQueryDto } from "../dto/query-params.dto";

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);

  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(courseId: string, createDto: CreateLessonDto): Promise<Lesson> {
    // Verify course exists
    const course = await this.courseRepository.findOne({
      where: { courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Get max order index for the course
    const maxOrder = await this.lessonRepository.findOne({
      where: { courseId: course.id },
      order: { orderIndex: "DESC" },
      select: ["orderIndex"],
    });
    const orderIndex = createDto.orderIndex ?? (maxOrder?.orderIndex || 0) + 1;

    const lesson = this.lessonRepository.create({
      courseId: course.id,
      title: createDto.title,
      description: createDto.description,
      videoUrl: createDto.videoUrl,
      quizData: createDto.quizData,
      orderIndex,
      durationMinutes: createDto.durationMinutes,
      isActive: createDto.isActive ?? true,
    });

    return await this.lessonRepository.save(lesson);
  }

  async findAll(query: LessonQueryDto) {
    const {
      courseId,
      isActive = true,
      sortBy = "orderIndex",
      sortOrder = "ASC",
    } = query;

    const where: any = {};

    if (courseId) {
      const course = await this.courseRepository.findOne({
        where: { courseId },
      });
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }
      where.courseId = course.id;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const order: any = {};
    order[sortBy] = sortOrder;

    const lessons = await this.lessonRepository.find({
      where,
      relations: ["course"],
      order,
    });

    return lessons;
  }

  async findOne(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
      relations: ["course"],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    return lesson;
  }

  async update(lessonId: string, updateDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    Object.assign(lesson, updateDto);
    return await this.lessonRepository.save(lesson);
  }

  async remove(lessonId: string): Promise<void> {
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    await this.lessonRepository.remove(lesson);
  }

  async reorder(lessonId: string, direction: "up" | "down"): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    const adjacentOrder =
      direction === "up" ? lesson.orderIndex - 1 : lesson.orderIndex + 1;

    const adjacentLesson = await this.lessonRepository.findOne({
      where: {
        courseId: lesson.courseId,
        orderIndex: adjacentOrder,
      },
    });

    if (!adjacentLesson) {
      throw new BadRequestException(`Cannot reorder: no adjacent lesson found`);
    }

    // Swap order indexes
    const tempOrder = lesson.orderIndex;
    lesson.orderIndex = adjacentLesson.orderIndex;
    adjacentLesson.orderIndex = tempOrder;

    await this.lessonRepository.save(lesson);
    await this.lessonRepository.save(adjacentLesson);

    return lesson;
  }
}
