import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { TravelPackage, TravelPackageDocument } from './schemas/travel-package.schema';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(TravelPackage.name)
    private readonly packageModel: Model<TravelPackageDocument>,
  ) {}

  async create(dto: CreatePackageDto): Promise<TravelPackage> {
    const created = new this.packageModel(dto);
    return created.save();
  }

  async findAll(filters: FilterQuery<TravelPackageDocument> = {}) {
    return this.packageModel.find(filters).lean().exec();
  }

  async findOne(id: string) {
    const pkg = await this.packageModel.findById(id).lean().exec();
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async update(id: string, dto: UpdatePackageDto) {
    const updated = await this.packageModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Package not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.packageModel.findByIdAndDelete(id).lean().exec();
    if (!res) throw new NotFoundException('Package not found');
    return res;
  }
}

