import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { BlogController } from "./blog.controller";
import { AdminBlogController } from "./blog-admin.controller";
import { BlogService } from "./blog.service";
import { BlogFileStorageService } from "./blog-file-storage.service";
import { BlogEntity } from "../entities/blog.entity";
import { BlogCategoryEntity } from "../entities/blog-category.entity";
import { BlogTagEntity } from "../entities/blog-tag.entity";
import { CommonModule } from "../common/common.module";
import { Admin } from "src/entities/admin.entity";

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([BlogEntity, BlogCategoryEntity, BlogTagEntity, Admin]),
    HttpModule,
  ],
  controllers: [BlogController, AdminBlogController],
  providers: [BlogService, BlogFileStorageService],
  exports: [BlogService],
})
export class BlogModule {}
