import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request.interface';

@Controller('packages')
@UseGuards(JwtAuthGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  private ensureAdmin(req: RequestWithUser) {
    if (req.user?.accountType !== 'admin') {
      throw new ForbiddenException('Only admin can perform this action');
    }
  }

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreatePackageDto) {
    this.ensureAdmin(req);
    return this.packagesService.create(dto);
  }

  @Get()
  findAll(
    @Query('destination') destination?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    const filters: Record<string, unknown> = {};
    if (destination) filters.destination = destination;
    if (type) filters.type = type;
    if (status) filters.status = status;
    return this.packagesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto, @Req() req: RequestWithUser) {
    this.ensureAdmin(req);
    return this.packagesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    this.ensureAdmin(req);
    return this.packagesService.remove(id);
  }
}

