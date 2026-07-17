import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { NoticeController } from "./notice.controller";
import { AdminNoticeController } from "./notice-admin.controller";
import { NoticeService } from "./notice.service";
import { NoticeFileStorageService } from "./notice-file-storage.service";
import { Notice } from "../entities/notice.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice]),
    HttpModule,
    CommonModule,
  ],
  controllers: [NoticeController, AdminNoticeController],
  providers: [NoticeService, NoticeFileStorageService],
  exports: [NoticeService],
})
export class NoticeModule {}
