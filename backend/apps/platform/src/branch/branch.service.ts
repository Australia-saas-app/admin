import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan, MoreThan } from "typeorm";
import { Branch } from "../entities/branch.entity";

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [branches, total] = await this.branchRepository.findAndCount({
      where: { isVisible: true, deletedAt: null },
      skip,
      take: limit,
      order: { displayOrder: "ASC" },
    });

    return {
      data: branches,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdmin(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [branches, total] = await this.branchRepository.findAndCount({
      where: { deletedAt: null },
      skip,
      take: limit,
      order: { displayOrder: "ASC" },
    });

    return {
      data: branches,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!branch) {
      throw new NotFoundException("Branch not found");
    }
    return branch;
  }

  async create(createBranchDto: {
    branchName: string;
    countryFlag?: string;
    address: string;
    phone?: string;
    email?: string;
    workingHours?: string;
    workingDays?: string[];
    services?: string[];
    socialLinks?: Array<{ name: string; url: string }>;
    isVisible?: boolean | string;
    createdBy?: string;
  }): Promise<Branch> {
    const lastBranch = await this.branchRepository.findOne({
      where: { deletedAt: null },
      order: { displayOrder: "DESC" },
    });
    const displayOrder = lastBranch ? lastBranch.displayOrder + 1 : 0;

    const branch = this.branchRepository.create({
      branchName: createBranchDto.branchName,
      countryFlag: createBranchDto.countryFlag,
      address: createBranchDto.address,
      phone: createBranchDto.phone,
      emailAddress: createBranchDto.email,
      workingHours: createBranchDto.workingHours,
      workingDays: createBranchDto.workingDays,
      services: createBranchDto.services || [],
      socialLinks: createBranchDto.socialLinks,
      isVisible: createBranchDto.isVisible === 'true' ? true : createBranchDto.isVisible === 'false' ? false : true,
      displayOrder,
      createdBy: createBranchDto.createdBy,
    });
    return this.branchRepository.save(branch);
  }

  async update(
    id: string,
    updateBranchDto: {
      branchName?: string;
      countryFlag?: string;
      address?: string;
      phone?: string;
      email?: string;
      workingHours?: string;
      workingDays?: string[];
      services?: string[];
      socialLinks?: Array<{ name: string; url: string }>;
      isVisible?: boolean | string;
    },
  ): Promise<Branch> {
    const branch = await this.findOne(id);

    if (updateBranchDto.branchName !== undefined) branch.branchName = updateBranchDto.branchName;
    if (updateBranchDto.countryFlag !== undefined) branch.countryFlag = updateBranchDto.countryFlag;
    if (updateBranchDto.address !== undefined) branch.address = updateBranchDto.address;
    if (updateBranchDto.phone !== undefined) branch.phone = updateBranchDto.phone;
    if (updateBranchDto.email !== undefined) branch.emailAddress = updateBranchDto.email;
    if (updateBranchDto.workingHours !== undefined) branch.workingHours = updateBranchDto.workingHours;
    if (updateBranchDto.workingDays !== undefined) branch.workingDays = updateBranchDto.workingDays;
    if (updateBranchDto.services !== undefined) branch.services = updateBranchDto.services;
    if (updateBranchDto.socialLinks !== undefined) branch.socialLinks = updateBranchDto.socialLinks;
    if (updateBranchDto.isVisible !== undefined) branch.isVisible = updateBranchDto.isVisible === 'true' ? true : updateBranchDto.isVisible === 'false' ? false : branch.isVisible;

    return this.branchRepository.save(branch);
  }

  async toggleVisibility(id: string): Promise<Branch> {
    const branch = await this.findOne(id);
    branch.isVisible = !branch.isVisible;
    return this.branchRepository.save(branch);
  }

  async reorder(id: string, direction: "up" | "down"): Promise<Branch> {
    const branch = await this.findOne(id);
    const currentOrder = branch.displayOrder;

    if (direction === "up") {
      const prevBranch = await this.branchRepository.findOne({
        where: {
          displayOrder: LessThan(currentOrder),
          deletedAt: null,
        },
        order: { displayOrder: "DESC" },
      });

      if (prevBranch) {
        const temp = prevBranch.displayOrder;
        prevBranch.displayOrder = currentOrder;
        branch.displayOrder = temp;
        await this.branchRepository.save([prevBranch, branch]);
      }
    } else if (direction === "down") {
      const nextBranch = await this.branchRepository.findOne({
        where: {
          displayOrder: MoreThan(currentOrder),
          deletedAt: null,
        },
        order: { displayOrder: "ASC" },
      });

      if (nextBranch) {
        const temp = nextBranch.displayOrder;
        nextBranch.displayOrder = currentOrder;
        branch.displayOrder = temp;
        await this.branchRepository.save([nextBranch, branch]);
      }
    }

    return branch;
  }

  async remove(id: string): Promise<void> {
    const branch = await this.findOne(id);
    await this.branchRepository.remove(branch);
  }

  async search(name: string): Promise<Branch[]> {
    const searchTerm = `%${name}%`;
    return this.branchRepository
      .createQueryBuilder("branch")
      .where("branch.branchName ILIKE :branchName", { branchName: searchTerm })
      .andWhere("branch.deletedAt IS NULL")
      .orderBy("branch.displayOrder", "ASC")
      .getMany();
  }
}
