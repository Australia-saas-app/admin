import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ContactUsService } from "./contact-us.service";

@ApiTags("contact-us")
@Controller("contact-us")
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: "Submit a contact form message" })
  async submitContactForm(
    @Body()
    contactData: {
      name: string;
      email: string;
      subject: string;
      message: string;
    },
  ) {
    const contact = await this.contactUsService.submitContactForm(contactData);
    return {
      message: "Contact form submitted successfully",
      data: contact,
    };
  }
}
