import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyProfileDto } from './dto/verify-profile.dto';
import { AddContactDto } from './dto/add-contact.dto';
import { ChangePrimaryContactDto } from './dto/change-primary-contact.dto';
import { DeleteContactDto } from './dto/delete-contact.dto';
import { ConfirmPasswordDto } from './dto/confirm-password.dto';
import { VerifyContactDto } from './dto/verify-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/request.interface';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  getProfile(@Request() req: UserRequest) {
    const authHeader = req.headers['authorization'];
    return this.profileService.getProfile(
      req.user.userId,
      {
        email: req.user.email,
        phone: req.user.phone,
      },
      authHeader,
    );
  }

  @Patch()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or account blocked',
  })
  updateProfile(
    @Request() req: UserRequest,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.userId, updateDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user profile with identity proof' })
  @ApiResponse({ status: 200, description: 'Profile verified successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or already verified',
  })
  verifyProfile(
    @Request() req: UserRequest,
    @Body() verifyDto: VerifyProfileDto,
  ) {
    return this.profileService.verifyProfile(req.user.userId, verifyDto);
  }

  @Patch('photo')
  @ApiOperation({ summary: 'Update profile photo' })
  @ApiResponse({
    status: 200,
    description: 'Profile photo updated successfully',
  })
  updateProfilePhoto(
    @Request() req: UserRequest,
    @Body('photoUrl') photoUrl: string,
  ) {
    return this.profileService.updateProfilePhoto(req.user.userId, photoUrl);
  }

  @Get('contacts')
  @ApiOperation({ summary: 'Get user contacts' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  getContacts(@Request() req: UserRequest) {
    return this.profileService.getContacts(req.user.userId);
  }

  @Post('contacts')
  @ApiOperation({ summary: 'Add contact (email or phone)' })
  @ApiResponse({ status: 201, description: 'Contact added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or limit reached' })
  addContact(
    @Request() req: UserRequest,
    @Body() addContactDto: AddContactDto,
  ) {
    return this.profileService.addContact(req.user.userId, addContactDto);
  }

  @Patch('contacts/primary')
  @ApiOperation({ summary: 'Change primary contact' })
  @ApiResponse({
    status: 200,
    description: 'Primary contact changed successfully',
  })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  changePrimaryContact(
    @Request() req: UserRequest,
    @Body() changeDto: ChangePrimaryContactDto,
  ) {
    return this.profileService.changePrimaryContact(req.user.userId, changeDto);
  }

  @Delete('contacts/:contactId')
  @ApiOperation({ summary: 'Delete contact' })
  @ApiParam({ name: 'contactId', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete primary contact' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  deleteContact(
    @Request() req: UserRequest,
    @Param('contactId') contactId: string,
    @Body() deleteDto: DeleteContactDto,
  ) {
    return this.profileService.deleteContact(
      req.user.userId,
      contactId,
      deleteDto,
    );
  }

  @Post('contacts/verify')
  @ApiOperation({ summary: 'Verify contact (email or phone) with OTP' })
  @ApiResponse({ status: 200, description: 'Contact verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  verifyContact(
    @Request() req: UserRequest,
    @Body() verifyDto: VerifyContactDto,
  ) {
    return this.profileService.verifyContact(
      req.user.userId,
      verifyDto.value,
      verifyDto.type,
      verifyDto.otp,
    );
  }

  @Post('auth/confirm-password')
  @ApiOperation({ summary: 'Confirm password for sensitive operations' })
  @ApiResponse({ status: 200, description: 'Password confirmed' })
  @ApiResponse({ status: 400, description: 'Invalid password' })
  confirmPassword(
    @Request() req: UserRequest,
    @Body() dto: ConfirmPasswordDto,
  ) {
    return this.profileService.confirmPassword(req.user.userId, dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  getProfileById(@Param('userId') userId: string, @Request() req: UserRequest) {
    const authHeader = req.headers['authorization'];
    return this.profileService.getProfile(userId, undefined, authHeader);
  }
}
