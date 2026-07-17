import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { EducationController } from "./education.controller";
import { CourseService } from "./services/course.service";
import { EducationCategoryService } from "./services/category.service";
import { LessonService } from "./services/lesson.service";
import { EnrollmentService } from "./services/enrollment.service";
import { CertificateService } from "./services/certificate.service";
import { Course } from "./entities/course.entity";
import { EducationCategory } from "./entities/education-category.entity";
import { Lesson } from "./entities/lesson.entity";
import { Enrollment } from "./entities/enrollment.entity";
import { Certificate } from "./entities/certificate.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Course,
      EducationCategory,
      Lesson,
      Enrollment,
      Certificate,
    ]),
  ],
  controllers: [EducationController],
  providers: [
    CourseService,
    EducationCategoryService,
    LessonService,
    EnrollmentService,
    CertificateService,
  ],
  exports: [
    CourseService,
    EducationCategoryService,
    LessonService,
    EnrollmentService,
    CertificateService,
  ],
})
export class EducationModule {}
