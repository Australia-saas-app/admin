import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactUsController } from "./contact-us.controller";
import { AdminContactUsController } from "./contact-us-admin.controller";
import { ContactUsService } from "./contact-us.service";
import { Contact } from "../entities/contact.entity";
import { CommonModule } from "../common/common.module";
import { Admin } from "src/entities/admin.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, Admin]),
    CommonModule,
  ],
  controllers: [ContactUsController, AdminContactUsController],
  providers: [ContactUsService],
  exports: [ContactUsService],
})
export class ContactUsModule {}
