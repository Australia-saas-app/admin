import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "../entities/employee.entity";
import { Branch } from "../entities/branch.entity";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      this.employeeRepository.find({
        where: { isVisible: true },
        skip,
        take: limit,
        relations: ['branch', 'manager'],
        order: { displayOrder: 'ASC', createdAt: 'DESC' },
      }),
      this.employeeRepository.count({ where: { isVisible: true } }),
    ]);

    return {
      data: employees,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdmin(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      this.employeeRepository.find({
        skip,
        take: limit,
        relations: ['branch', 'manager'],
        order: { displayOrder: 'ASC', createdAt: 'DESC' },
      }),
      this.employeeRepository.count(),
    ]);

    return {
      data: employees,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ 
      where: { id },
      relations: ['branch', 'manager'],
    });
    if (!employee) {
      throw new NotFoundException("Team member not found");
    }
    return employee;
  }

  async create(createTeamDto: {
    firstName: string;
    lastName: string;
    position: string;
    bio?: string;
    photoUrl?: string;
    email?: string;
    linkedinUrl?: string;
    department?: string;
    branchId?: string;
    displayOrder?: number;
    isVisible?: boolean;
    managerId?: string;
    salary?: number;
    createdBy?: string;
  }) {
    const employee = this.employeeRepository.create({
      firstName: createTeamDto.firstName,
      lastName: createTeamDto.lastName,
      position: createTeamDto.position,
      department: createTeamDto.department || 'General',
      bio: createTeamDto.bio,
      photoUrl: createTeamDto.photoUrl,
      linkedinUrl: createTeamDto.linkedinUrl,
      branchId: createTeamDto.branchId || null,
      managerId: createTeamDto.managerId || null,
      salary: createTeamDto.salary ?? 0,
      employeeId: createTeamDto.email || `${createTeamDto.firstName.toLowerCase()}-${createTeamDto.lastName.toLowerCase()}`,
      displayOrder: createTeamDto.displayOrder ?? 0,
      isVisible: createTeamDto.isVisible ?? true,
      createdBy: createTeamDto.createdBy || null,
    });

    return await this.employeeRepository.save(employee);
  }

  async update(
    id: string,
    updateTeamDto: {
      firstName?: string;
      lastName?: string;
      position?: string;
      bio?: string;
      photoUrl?: string;
      email?: string;
      linkedinUrl?: string;
      department?: string;
      branchId?: string;
      displayOrder?: number;
      isVisible?: boolean;
    }
  ) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException("Team member not found");
    }

    // Update fields
    if (updateTeamDto.firstName) employee.firstName = updateTeamDto.firstName;
    if (updateTeamDto.lastName) employee.lastName = updateTeamDto.lastName;
    if (updateTeamDto.position) employee.position = updateTeamDto.position;
    if (updateTeamDto.department) employee.department = updateTeamDto.department;
    if (updateTeamDto.bio !== undefined) employee.bio = updateTeamDto.bio;
    if (updateTeamDto.photoUrl !== undefined) employee.photoUrl = updateTeamDto.photoUrl;
    if (updateTeamDto.linkedinUrl !== undefined) employee.linkedinUrl = updateTeamDto.linkedinUrl;
    if (updateTeamDto.branchId !== undefined) employee.branchId = updateTeamDto.branchId;
    if (updateTeamDto.email) employee.employeeId = updateTeamDto.email;
    if (updateTeamDto.displayOrder !== undefined) employee.displayOrder = updateTeamDto.displayOrder;
    if (updateTeamDto.isVisible !== undefined) employee.isVisible = updateTeamDto.isVisible;

    return await this.employeeRepository.save(employee);
  }

  async remove(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException("Team member not found");
    }

    await this.employeeRepository.remove(employee);
    return { message: "Team member deleted successfully" };
  }

  async reorder(id: string, direction: 'up' | 'down'): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException("Team member not found");
    }

    // Find all employees ordered by displayOrder
    const employees = await this.employeeRepository.find({
      order: { displayOrder: 'ASC' },
    });

    const currentIndex = employees.findIndex(e => e.id === id);
    let newIndex = currentIndex;

    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < employees.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      // Swap displayOrder values
      const tempOrder = employee.displayOrder;
      employee.displayOrder = employees[newIndex].displayOrder;
      employees[newIndex].displayOrder = tempOrder;

      await this.employeeRepository.save([employee, employees[newIndex]]);
    }

    return employee;
  }

  async toggleVisibility(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException("Team member not found");
    }

    employee.isVisible = !employee.isVisible;
    return await this.employeeRepository.save(employee);
  }

  async findByDepartment(department: string) {
    return await this.employeeRepository.find({
      where: { department, isVisible: true },
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
      relations: ['branch', 'manager'],
    });
  }

  async findByBranch(branchId: string) {
    return await this.employeeRepository.find({
      where: { branchId, isVisible: true },
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
      relations: ['branch', 'manager'],
    });
  }

  async getDepartments(): Promise<string[]> {
    const result = await this.employeeRepository
      .createQueryBuilder("employee")
      .select("DISTINCT employee.department", "department")
      .where("employee.department IS NOT NULL")
      .andWhere("employee.department != ''")
      .getRawMany();
    
    return result.map(r => r.department).filter(Boolean);
  }

  async getBranches() {
    return await this.branchRepository.find({
      where: { isVisible: true },
      order: { branchName: 'ASC' },
    });
  }

  async search(name: string): Promise<Employee[]> {
    const searchTerm = `%${name}%`;
    return this.employeeRepository
      .createQueryBuilder("employee")
      .where("(employee.firstName ILIKE :firstName OR employee.lastName ILIKE :lastName)", { firstName: searchTerm, lastName: searchTerm })
      .orderBy("employee.displayOrder", "ASC")
      .addOrderBy("employee.createdAt", "DESC")
      .getMany();
  }
}