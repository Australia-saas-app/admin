import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "../entities/company.entity";

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(data: Partial<Company>): Promise<Company> {
    const company = this.companyRepository.create({
      ...data,
      createdBy: null,
    });
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      where: { deletedAt: null },
      order: { createdAt: "DESC" },
    });
  }

  async findAllAdmin(): Promise<Company[]> {
    return this.companyRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(id: string, data: Partial<Company>): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, data);
    return this.companyRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.companyRepository.softDelete(id);
  }

  async recover(id: string): Promise<Company> {
    await this.companyRepository.restore(id);
    return this.findOne(id);
  }

  async toggleVisibility(id: string): Promise<Company> {
    const company = await this.findOne(id);
    company.isVisible = !company.isVisible;
    return this.companyRepository.save(company);
  }

  async search(name: string): Promise<Company[]> {
    return this.companyRepository
      .createQueryBuilder("company")
      .where("company.name ILIKE :name", { name: `%${name}%` })
      .andWhere("company.deletedAt IS NULL")
      .orderBy("company.createdAt", "DESC")
      .getMany();
  }
}
