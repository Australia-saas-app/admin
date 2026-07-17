import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { GalleryController } from "./gallery.controller";
import { GalleryService } from "./gallery.service";
import { FileStorageService } from "./file-storage.service";
import { Gallery } from "../entities/gallery.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery]),
    HttpModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService, FileStorageService],
  exports: [GalleryService],
})
export class GalleryModule {}
