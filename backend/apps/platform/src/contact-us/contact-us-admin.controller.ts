import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ContactUsService } from "../contact-us/contact-us.service";
import { PlatformAuthGuard } from "../common/guards/platform-auth.guard";

@ApiTags("admin-contact-us")
@Controller("admin/contact-us")
@UseGuards(PlatformAuthGuard)
export class AdminContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Get()
  @ApiOperation({ summary: "Get contact form submissions" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiBearerAuth()
  async getContactSubmissions(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.contactUsService.findAll(page, limit);
  }

  @Get("search/:name")
  @ApiOperation({ summary: "Search contact submissions by name" })
  @ApiParam({ name: "name", description: "Search term" })
  @ApiBearerAuth()
  async searchContacts(@Param("name") name: string) {
    return this.contactUsService.search(name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get contact submission by ID" })
  @ApiParam({ name: "id", description: "Contact submission ID" })
  @ApiBearerAuth()
  async getContactById(@Param("id") id: string) {
    const contact = await this.contactUsService.findOne(id);
    return {
      data: contact,
    };
  }

  @Post()
  @ApiOperation({ summary: "Get contact submissions by IDs" })
  @ApiBearerAuth()
  async getContactsByIds(
    @Body() body: { contactIds: string[] },
  ) {
    const contacts = await this.contactUsService.findByIds(body.contactIds);
    return {
      success: true,
      data: contacts,
    };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update contact submission" })
  @ApiParam({ name: "id", description: "Contact submission ID" })
  @ApiBearerAuth()
  async updateContact(
    @Param("id") id: string,
    @Body() updateData: { status?: string; assignedTo?: string; metadata?: Record<string, any>; isRead?: boolean },
  ) {
    const contact = await this.contactUsService.update(id, updateData);
    return {
      message: "Contact updated successfully",
      data: contact,
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a contact submission" })
  @ApiParam({ name: "id", description: "Contact submission ID" })
  @ApiBearerAuth()
  async deleteContactSubmission(@Param("id") id: string) {
    await this.contactUsService.deleteOne(id);
    return {
      message: "Contact submission deleted successfully",
    };
  }

  @Delete()
  @ApiOperation({ summary: "Bulk delete contact submissions" })
  @ApiBearerAuth()
  async bulkDeleteContactSubmissions(
    @Body() deleteData: { contactIds: string[] },
  ) {
    const result = await this.contactUsService.deleteMany(
      deleteData.contactIds,
    );
    return {
      message: "Contact submissions deleted successfully",
      deletedCount: result.deletedCount,
    };
  }
}
