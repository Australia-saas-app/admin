import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CourseService } from "./services/course.service";
import { EducationCategoryService } from "./services/category.service";
import { LessonService } from "./services/lesson.service";
import { EnrollmentService } from "./services/enrollment.service";
import { CertificateService } from "./services/certificate.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
  CourseQueryDto,
  CategoryQueryDto,
  LessonQueryDto,
  EnrollmentQueryDto,
  ReorderDto,
} from "./dto/query-params.dto";
import { AdminAuthGuard } from "../common/guards/admin-auth.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  RequestWithAdmin,
  RequestWithUser,
} from "../common/interfaces/request.interface";

@ApiTags("education")
@Controller("education")
export class EducationController {
  constructor(
    private readonly courseService: CourseService,
    private readonly categoryService: EducationCategoryService,
    private readonly lessonService: LessonService,
    private readonly enrollmentService: EnrollmentService,
    private readonly certificateService: CertificateService,
  ) {}

  @Get("health")
  @ApiOperation({ summary: "Health check endpoint" })
  healthCheck() {
    return {
      status: "ok",
      service: "education-service",
      timestamp: new Date().toISOString(),
    };
  }

  // ==========================================
  // PUBLIC ROUTES - Courses
  // ==========================================

  @Get("courses")
  @ApiOperation({ summary: "Get all visible courses (Public)" })
  @ApiResponse({ status: 200, description: "List of courses" })
  async getCourses(@Query() query: CourseQueryDto) {
    return this.courseService.findAll(query, false);
  }

  @Get("courses/:courseId")
  @ApiOperation({ summary: "Get single course (Public)" })
  @ApiResponse({ status: 200, description: "Course details" })
  @ApiResponse({ status: 404, description: "Course not found" })
  async getCourse(@Param("courseId") courseId: string) {
    return this.courseService.findOne(courseId, false);
  }

  // ==========================================
  // AUTHENTICATED USER/AGENCY ROUTES - Courses
  // ==========================================

  @Post("courses")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create course (User/Agency/Business)" })
  @ApiResponse({ status: 201, description: "Course created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createCourse(
    @Body() createDto: CreateCourseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createCourseForAccountTypes(createDto, req, [
      "user",
      "agency",
      "business",
    ]);
  }

  @Post("courses/user")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create course (User only)" })
  async createUserCourse(
    @Body() createDto: CreateCourseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createCourseForAccountTypes(createDto, req, ["user"]);
  }

  @Post("courses/agency")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create course (Agency only)" })
  async createAgencyCourse(
    @Body() createDto: CreateCourseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createCourseForAccountTypes(createDto, req, ["agency"]);
  }

  @Get("courses/admin/list")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get all courses (Admin)" })
  @ApiResponse({ status: 200, description: "List of all courses" })
  async getAdminCourses(@Query() query: CourseQueryDto, @Req() req: Request) {
    const rawIsVisible = req.query?.isVisible as string | undefined;
    if (
      rawIsVisible === "" ||
      rawIsVisible === null ||
      rawIsVisible === undefined
    ) {
      query.isVisible = undefined;
    }
    return this.courseService.findAll(query, true);
  }

  @Post("courses/admin")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create course (Admin)" })
  @ApiResponse({ status: 201, description: "Course created successfully" })
  async createAdminCourse(
    @Body() createDto: CreateCourseDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.courseService.create(createDto, `admin-${req.admin.adminId}`);
  }

  @Get("courses/admin/:courseId")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get single course (Admin)" })
  async getAdminCourse(@Param("courseId") courseId: string) {
    return this.courseService.findOne(courseId, true);
  }

  @Patch("courses/:courseId")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update course (Admin)" })
  @ApiResponse({ status: 200, description: "Course updated successfully" })
  @ApiResponse({ status: 404, description: "Course not found" })
  async updateCourse(
    @Param("courseId") courseId: string,
    @Body() updateDto: UpdateCourseDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.courseService.update(
      courseId,
      updateDto,
      req.admin?.email || "system",
    );
  }

  @Delete("courses/:courseId")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete course (Admin)" })
  @ApiResponse({ status: 200, description: "Course deleted successfully" })
  @ApiResponse({ status: 404, description: "Course not found" })
  async deleteCourse(@Param("courseId") courseId: string) {
    await this.courseService.remove(courseId);
    return { success: true, message: "Course deleted successfully" };
  }

  @Patch("courses/user/:courseId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update course (User owns course)" })
  async updateUserCourse(
    @Param("courseId") courseId: string,
    @Body() updateDto: UpdateCourseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updateCourseForAccountTypes(courseId, updateDto, req, ["user"]);
  }

  @Patch("courses/agency/:courseId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update course (Agency owns course)" })
  async updateAgencyCourse(
    @Param("courseId") courseId: string,
    @Body() updateDto: UpdateCourseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updateCourseForAccountTypes(courseId, updateDto, req, [
      "agency",
    ]);
  }

  @Delete("courses/user/:courseId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete course (User owns course)" })
  async deleteUserCourse(
    @Param("courseId") courseId: string,
    @Req() req: RequestWithUser,
  ) {
    await this.deleteCourseForAccountTypes(courseId, req, ["user"]);
    return { success: true, message: "Course deleted successfully" };
  }

  @Delete("courses/agency/:courseId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete course (Agency owns course)" })
  async deleteAgencyCourse(
    @Param("courseId") courseId: string,
    @Req() req: RequestWithUser,
  ) {
    await this.deleteCourseForAccountTypes(courseId, req, ["agency"]);
    return { success: true, message: "Course deleted successfully" };
  }

  @Patch("courses/:courseId/visibility")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Toggle course visibility (Admin)" })
  @ApiResponse({ status: 200, description: "Visibility updated" })
  async toggleCourseVisibility(
    @Param("courseId") courseId: string,
    @Body("isVisible") isVisible: boolean,
    @Req() req: RequestWithAdmin,
  ) {
    return this.courseService.toggleVisibility(
      courseId,
      isVisible,
      req.admin?.email || "system",
    );
  }

  @Patch("courses/:courseId/reorder")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Reorder course (Admin)" })
  @ApiResponse({ status: 200, description: "Course reordered" })
  async reorderCourse(
    @Param("courseId") courseId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    return this.courseService.reorder(courseId, reorderDto.direction);
  }

  // ==========================================
  // LESSON ROUTES
  // ==========================================

  @Post("courses/:courseId/lessons")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create lesson for course (Instructor/Admin)" })
  @ApiResponse({ status: 201, description: "Lesson created successfully" })
  async createLesson(
    @Param("courseId") courseId: string,
    @Body() createDto: CreateLessonDto,
    @Req() req: RequestWithUser,
  ) {
    // Verify ownership or admin
    if (req.user.accountType !== "admin") {
      await this.verifyCourseOwnership(courseId, req.user.userId);
    }
    return this.lessonService.create(courseId, createDto);
  }

  @Get("courses/:courseId/lessons")
  @ApiOperation({ summary: "Get lessons for course (Public)" })
  @ApiResponse({ status: 200, description: "List of lessons" })
  async getLessons(
    @Param("courseId") courseId: string,
    @Query() query: LessonQueryDto,
  ) {
    query.courseId = courseId;
    return this.lessonService.findAll(query);
  }

  @Get("lessons/:lessonId")
  @ApiOperation({ summary: "Get single lesson (Public)" })
  @ApiResponse({ status: 200, description: "Lesson details" })
  async getLesson(@Param("lessonId") lessonId: string) {
    return this.lessonService.findOne(lessonId);
  }

  @Patch("lessons/:lessonId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update lesson (Instructor/Admin)" })
  @ApiResponse({ status: 200, description: "Lesson updated successfully" })
  async updateLesson(
    @Param("lessonId") lessonId: string,
    @Body() updateDto: UpdateLessonDto,
    @Req() req: RequestWithUser,
  ) {
    // Verify ownership or admin
    if (req.user.accountType !== "admin") {
      const lesson = await this.lessonService.findOne(lessonId);
      await this.verifyCourseOwnership(lesson.course.courseId, req.user.userId);
    }
    return this.lessonService.update(lessonId, updateDto);
  }

  @Delete("lessons/:lessonId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete lesson (Instructor/Admin)" })
  async deleteLesson(
    @Param("lessonId") lessonId: string,
    @Req() req: RequestWithUser,
  ) {
    if (req.user.accountType !== "admin") {
      const lesson = await this.lessonService.findOne(lessonId);
      await this.verifyCourseOwnership(lesson.course.courseId, req.user.userId);
    }
    await this.lessonService.remove(lessonId);
    return { success: true, message: "Lesson deleted successfully" };
  }

  @Patch("lessons/:lessonId/reorder")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Reorder lesson (Instructor/Admin)" })
  async reorderLesson(
    @Param("lessonId") lessonId: string,
    @Body() reorderDto: ReorderDto,
    @Req() req: RequestWithUser,
  ) {
    if (req.user.accountType !== "admin") {
      const lesson = await this.lessonService.findOne(lessonId);
      await this.verifyCourseOwnership(lesson.course.courseId, req.user.userId);
    }
    return this.lessonService.reorder(lessonId, reorderDto.direction);
  }

  // ==========================================
  // ENROLLMENT ROUTES
  // ==========================================

  @Post("enrollments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Enroll in course (User)" })
  @ApiResponse({ status: 201, description: "Enrollment created successfully" })
  async createEnrollment(
    @Body() createDto: CreateEnrollmentDto,
    @Req() req: RequestWithUser,
  ) {
    createDto.studentId = req.user.userId;
    createDto.studentName = req.user.name;
    return this.enrollmentService.create(createDto);
  }

  @Get("enrollments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get user enrollments (User)" })
  async getUserEnrollments(
    @Query() query: EnrollmentQueryDto,
    @Req() req: RequestWithUser,
  ) {
    query.studentId = req.user.userId;
    return this.enrollmentService.findAll(query);
  }

  @Get("enrollments/admin")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get all enrollments (Admin)" })
  async getAllEnrollments(@Query() query: EnrollmentQueryDto) {
    return this.enrollmentService.findAll(query);
  }

  @Get("enrollments/:enrollmentId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get enrollment details (User/Admin)" })
  async getEnrollment(
    @Param("enrollmentId") enrollmentId: string,
    @Req() req: RequestWithUser,
  ) {
    const enrollment = await this.enrollmentService.findOne(enrollmentId);
    if (
      req.user.accountType !== "admin" &&
      enrollment.studentId !== req.user.userId
    ) {
      throw new ForbiddenException("Access denied");
    }
    return enrollment;
  }

  @Patch("enrollments/:enrollmentId/progress")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update enrollment progress (User)" })
  async updateProgress(
    @Param("enrollmentId") enrollmentId: string,
    @Body("completionPercentage") completionPercentage: number,
    @Req() req: RequestWithUser,
  ) {
    return this.enrollmentService.updateProgress(
      enrollmentId,
      completionPercentage,
      req.user.userId,
    );
  }

  @Patch("enrollments/:enrollmentId/complete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Mark enrollment as completed (User)" })
  async markCompleted(
    @Param("enrollmentId") enrollmentId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.enrollmentService.markCompleted(enrollmentId, req.user.userId);
  }

  @Post("enrollments/:enrollmentId/certificate")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Issue certificate (Admin)" })
  async issueCertificate(@Param("enrollmentId") enrollmentId: string) {
    return this.enrollmentService.issueCertificate(enrollmentId);
  }

  @Get("certificates")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get user certificates (User)" })
  async getUserCertificates() {
    return this.certificateService.findAll(); // Will be filtered by student in service if needed
  }

  @Get("certificates/:certificateId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get certificate details (User/Admin)" })
  async getCertificate(
    @Param("certificateId") certificateId: string,
    @Req() req: RequestWithUser,
  ) {
    const certificate = await this.certificateService.findOne(certificateId);
    if (
      req.user.accountType !== "admin" &&
      certificate.enrollment.studentId !== req.user.userId
    ) {
      throw new ForbiddenException("Access denied");
    }
    return certificate;
  }

  // ==========================================
  // PUBLIC ROUTES - Categories
  // ==========================================

  @Get("categories/list")
  @ApiOperation({ summary: "Get all active categories (Public)" })
  @ApiResponse({ status: 200, description: "List of categories" })
  async getCategories(@Query() query: CategoryQueryDto) {
    const activeQuery = { ...query, isActive: true };
    return this.categoryService.findAll(activeQuery);
  }

  // ==========================================
  // ADMIN ROUTES - Categories
  // ==========================================

  @Post("categories")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create category (Admin)" })
  @ApiResponse({ status: 201, description: "Category created successfully" })
  @ApiResponse({ status: 409, description: "Category already exists" })
  async createCategory(@Body() createDto: CreateCategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Get("categories/admin/list")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get all categories (Admin)" })
  async getAdminCategories(@Query() query: CategoryQueryDto) {
    return this.categoryService.findAll(query);
  }

  @Get("categories/admin/:categoryId")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get single category (Admin)" })
  async getAdminCategory(@Param("categoryId") categoryId: string) {
    return this.categoryService.findOne(categoryId);
  }

  @Patch("categories/:categoryId")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update category (Admin)" })
  async updateCategory(
    @Param("categoryId") categoryId: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(categoryId, updateDto);
  }

  @Delete("categories/:categoryId")
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete category (Admin)" })
  @ApiResponse({ status: 400, description: "Category is in use" })
  async deleteCategory(@Param("categoryId") categoryId: string) {
    await this.categoryService.remove(categoryId);
    return { success: true, message: "Category deleted successfully" };
  }

  // ==========================================
  // PRIVATE METHODS
  // ==========================================

  private createCourseForAccountTypes(
    createDto: CreateCourseDto,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, "create courses");
    return this.courseService.create(createDto, user.userId);
  }

  private updateCourseForAccountTypes(
    courseId: string,
    updateDto: UpdateCourseDto,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, "update courses");
    return this.courseService.updateOwnedCourse(
      courseId,
      updateDto,
      user.userId,
    );
  }

  private async deleteCourseForAccountTypes(
    courseId: string,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, "delete courses");
    await this.courseService.removeOwnedCourse(courseId, user.userId);
  }

  private async verifyCourseOwnership(courseId: string, userId: string) {
    const course = await this.courseService.findOne(courseId, true);
    if (course.createdBy !== userId && course.instructorId !== userId) {
      throw new ForbiddenException("Access denied: not the course instructor");
    }
  }

  private ensureAccountType(
    req: RequestWithUser,
    allowedTypes: string[],
    action: string,
  ) {
    const user = req.user;
    if (!user?.accountType) {
      throw new ForbiddenException("Invalid user context");
    }

    if (!allowedTypes.includes(user.accountType)) {
      throw new ForbiddenException(
        `Only ${allowedTypes.join("/")} accounts can ${action}`,
      );
    }

    if (!user.userId) {
      throw new ForbiddenException("Missing user identifier");
    }

    return user;
  }
}
