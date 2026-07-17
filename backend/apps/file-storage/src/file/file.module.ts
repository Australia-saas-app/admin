import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FolderService } from './folder.service';
import { FileVersionService } from './file-version.service';
import { FileShareService } from './file-share.service';
import { FileValidationService } from './file-validation.service';
import { R2StorageService } from './r2-storage.service';
import { FileObject } from './file.entity';
import { Folder } from './folder.entity';
import { FileVersion } from './file-version.entity';
import { FileShare } from './file-share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileObject, Folder, FileVersion, FileShare])],
  controllers: [FileController],
  providers: [
    FileService,
    FolderService,
    FileVersionService,
    FileShareService,
    FileValidationService,
    R2StorageService,
  ],
  exports: [FileValidationService],
})
export class FileModule {}

