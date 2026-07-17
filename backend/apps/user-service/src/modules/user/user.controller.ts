import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SubmitKycBodyDto } from './dto/submit-kyc-body.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req: any) {
    const userId = req.user?.userId;
    return this.userService.getProfile(userId);
  }

  @Patch('profile')
  updateProfile(@Request() req: any, @Body() updates: any) {
    const userId = req.user?.userId;
    return this.userService.updateProfile(userId, updates);
  }

  @Delete('profile')
  deleteProfile(@Request() req: any) {
    const userId = req.user?.userId;
    return this.userService.softDeleteProfile(userId);
  }

  @Get('profile/public/:userId')
  getPublicProfile(@Param('userId') userId: string) {
    return this.userService.getPublicProfile(userId);
  }

  @Patch('profile/photo')
  updateProfilePhoto(@Request() req: any, @Body() body: { profilePhoto: string }) {
    const userId = req.user?.userId;
    return this.userService.updateProfilePhoto(userId, body.profilePhoto);
  }

  @Patch('password')
  updatePassword(
    @Request() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = req.user?.userId;
    return this.userService.updatePassword(userId, body.currentPassword, body.newPassword);
  }

  @Patch('preferences')
  updatePreferences(@Request() req: any, @Body() preferences: any) {
    const userId = req.user?.userId;
    return this.userService.updatePreferences(userId, preferences);
  }

  @Get('kyc/status')
  getKycStatus(@Request() req: any) {
    const userId = req.user?.userId;
    return this.userService.getKycStatus(userId);
  }

  @Get('kyc/me')
  getMyKyc(@Request() req: any) {
    const userId = req.user?.userId;
    return this.userService.getKycById(userId);
  }

  @Post('kyc/submit')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'governmentId', maxCount: 1 },
      ],
      {
        limits: { fileSize: 10 * 1024 * 1024 },
      },
    ),
  )
  submitKyc(
    @Request() req: any,
    @Body() kycBodyDto: SubmitKycBodyDto,
    @UploadedFiles() files: { photo?: UploadedFile[]; governmentId?: UploadedFile[] },
  ) {
    const userId = req.user?.userId;
    return this.userService.submitKyc(userId, kycBodyDto, files);
  }

  @Post('kyc/resubmit')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'governmentId', maxCount: 1 },
      ],
      {
        limits: { fileSize: 10 * 1024 * 1024 },
      },
    ),
  )
  resubmitKyc(
    @Request() req: any,
    @Body() kycBodyDto: SubmitKycBodyDto,
    @UploadedFiles() files: { photo?: UploadedFile[]; governmentId?: UploadedFile[] },
  ) {
    const userId = req.user?.userId;
    if (!files?.photo?.[0]) {
      throw new BadRequestException('Photo file is required');
    }
    if (!files?.governmentId?.[0]) {
      throw new BadRequestException('Government ID file is required');
    }
    return this.userService.resubmitKyc(userId, kycBodyDto, files);
  }

  @Get('kyc/pending')
  getPendingKyc(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.userService.getPendingKyc(page, limit);
  }

  @Get('kyc/:userId')
  getKycById(@Param('userId') userId: string) {
    return this.userService.getKycById(userId);
  }

  @Post('kyc/:userId/review')
  reviewKyc(@Param('userId') userId: string, @Request() req: any, @Body() reviewDto: ReviewKycDto) {
    const adminId = req.admin?.adminId || req.user?.userId;
    return this.userService.reviewKyc(userId, adminId, reviewDto);
  }
}