import { Module } from "@nestjs/common";
import { GalleryModule } from "../gallery/gallery.module";
import { CommonModule } from "../common/common.module";
import { AdminGalleryController } from "./admin-gallery.controller";

@Module({
  imports: [GalleryModule, CommonModule],
  controllers: [AdminGalleryController],
})
export class AdminModule {}
