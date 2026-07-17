import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Enrollment } from "../entities/enrollment.entity";
import { Course } from "../entities/course.entity";
import { Certificate } from "../entities/certificate.entity";
import { CreateEnrollmentDto } from "../dto/create-enrollment.dto";
import { EnrollmentQueryDto } from "../dto/query-params.dto";

@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger(EnrollmentService.name);

  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly httpService: HttpService,
  ) {}

  async create(createDto: CreateEnrollmentDto): Promise<Enrollment> {
    // Verify course exists
    const course = await this.courseRepository.findOne({
      where: { courseId: createDto.courseId },
    });

    if (!course) {
      throw new NotFoundException(
        `Course with ID ${createDto.courseId} not found`,
      );
    }

    // Check if student is already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        courseId: course.id,
        studentId: createDto.studentId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException("Student is already enrolled in this course");
    }

    // Handle payment for paid courses
    let transactionId = createDto.transactionId;
    let paidAmount = createDto.paidAmount || 0;

    if (course.price > 0) {
      try {
        // Call Payment Service to process payment
        const paymentResponse = await firstValueFrom(
          this.httpService.post(
            `${process.env.PAYMENT_SERVICE_URL || "http://payment:3004"}/wallet/buy`,
            {
              amount: course.price,
              currency: course.currency,
              description: `Enrollment in course: ${course.title}`,
              referenceId: `course_${course.courseId}`,
              paymentMethod: createDto.paymentMethod || "card",
            },
            {
              headers: {
                "Content-Type": "application/json",
                // Add JWT token if available from request context
              },
            },
          ),
        );

        transactionId = (paymentResponse.data as any).transactionId;
        paidAmount = course.price;
      } catch (error) {
        this.logger.error("Payment processing failed", error);
        throw new BadRequestException(
          "Payment processing failed. Please try again.",
        );
      }
    }

    const enrollment = this.enrollmentRepository.create({
      courseId: course.id,
      studentId: createDto.studentId,
      studentName: createDto.studentName,
      paidAmount,
      currency: createDto.currency || course.currency,
      paymentMethod: createDto.paymentMethod,
      transactionId,
      isCompleted: createDto.isCompleted ?? false,
      completionPercentage: 0,
    });

    return await this.enrollmentRepository.save(enrollment);
  }

  async findAll(query: EnrollmentQueryDto) {
    const {
      page = 1,
      limit = 10,
      courseId,
      studentId,
      isCompleted,
      sortBy = "enrollmentDate",
      sortOrder = "DESC",
    } = query;
    const skip = (page - 1) * limit;

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

    if (studentId) {
      where.studentId = studentId;
    }

    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted;
    }

    const order: any = {};
    order[sortBy] = sortOrder;

    const [enrollments, total] = await this.enrollmentRepository.findAndCount({
      where,
      relations: ["course"],
      order,
      skip,
      take: limit,
    });

    return {
      enrollments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(enrollmentId: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { enrollmentId },
      relations: ["course"],
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollmentId} not found`,
      );
    }

    return enrollment;
  }

  async updateProgress(
    enrollmentId: string,
    completionPercentage: number,
    studentId?: string,
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollmentId} not found`,
      );
    }

    // Verify ownership if studentId provided
    if (studentId && enrollment.studentId !== studentId) {
      throw new BadRequestException("Access denied");
    }

    enrollment.completionPercentage = Math.min(
      100,
      Math.max(0, completionPercentage),
    );

    if (enrollment.completionPercentage >= 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completionDate = new Date();
    }

    return await this.enrollmentRepository.save(enrollment);
  }

  async markCompleted(
    enrollmentId: string,
    studentId?: string,
  ): Promise<Enrollment> {
    return this.updateProgress(enrollmentId, 100, studentId);
  }

  async issueCertificate(enrollmentId: string): Promise<Certificate> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { enrollmentId },
      relations: ["course"],
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollmentId} not found`,
      );
    }

    if (!enrollment.isCompleted) {
      throw new BadRequestException(
        "Cannot issue certificate for incomplete enrollment",
      );
    }

    if (enrollment.certificateIssued) {
      throw new BadRequestException(
        "Certificate already issued for this enrollment",
      );
    }

    // Generate certificate
    const certificate = this.certificateRepository.create({
      enrollmentId: enrollment.id,
      studentName: enrollment.studentName || enrollment.studentId,
      courseTitle: enrollment.course.title,
      issuedBy: "Vero2 Education Platform",
    });

    const savedCertificate = await this.certificateRepository.save(certificate);

    // Update enrollment
    enrollment.certificateIssued = true;
    enrollment.certificateUrl = `certificates/${savedCertificate.certificateId}.pdf`;
    await this.enrollmentRepository.save(enrollment);

    return savedCertificate;
  }

  async remove(enrollmentId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollmentId} not found`,
      );
    }

    await this.enrollmentRepository.remove(enrollment);
  }
}
