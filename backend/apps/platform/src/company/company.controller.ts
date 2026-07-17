import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { Company } from "../entities/company.entity";
import { PlatformAuthGuard } from "../common/guards/platform-auth.guard";

@ApiTags("Company")
@Controller("company")
@UseGuards(PlatformAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  private getAdminId(req: Request): string | undefined {
    return (req as any).admin?.adminId;
  }

  @Post()
  @ApiOperation({ summary: "Create a new company" })
  @ApiResponse({
    status: 201,
    description: "Company created successfully",
    type: Company,
  })
  create(@Body() createCompanyDto: Partial<Company>) {
    return this.companyService.create({
      ...createCompanyDto,
    });
  }

  @Get()
  @ApiOperation({ summary: "Get all companies" })
  @ApiResponse({
    status: 200,
    description: "Companies retrieved successfully",
    type: [Company],
  })
  findAll() {
    return this.companyService.findAll();
  }

  @Get("search/:name")
  @ApiOperation({ summary: "Search companies by name" })
  @ApiParam({ name: "name", description: "Search term" })
  @ApiResponse({
    status: 200,
    description: "Companies searched successfully",
    type: [Company],
  })
  search(@Param("name") name: string) {
    return this.companyService.search(name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a company by ID" })
  @ApiResponse({
    status: 200,
    description: "Company retrieved successfully",
    type: Company,
  })
  @ApiResponse({ status: 404, description: "Company not found" })
  findOne(@Param("id") id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a company" })
  @ApiResponse({
    status: 200,
    description: "Company updated successfully",
    type: Company,
  })
  update(@Param("id") id: string, @Body() updateCompanyDto: Partial<Company>) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete a company" })
  @ApiResponse({ status: 200, description: "Company deleted successfully" })
  remove(@Param("id") id: string) {
    return this.companyService.remove(id);
  }

  @Patch(":id/visibility")
  @ApiOperation({ summary: "Toggle company visibility" })
  @ApiResponse({
    status: 200,
    description: "Company visibility toggled successfully",
    type: Company,
  })
  toggleVisibility(@Param("id") id: string) {
    return this.companyService.toggleVisibility(id);
  }

  @Post(":id/recover")
  @ApiOperation({ summary: "Recover a soft deleted company" })
  @ApiResponse({
    status: 200,
    description: "Company recovered successfully",
    type: Company,
  })
  recover(@Param("id") id: string) {
    return this.companyService.recover(id);
  }
}
