import {
  Controller,
  Post,
  UploadedFile,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUser } from 'src/common/decorators';
import { UserInstance } from '../user/user.dto';
import * as path from 'path';
import * as fs from 'fs';
import { FileService } from './file.service';
import * as multer from 'multer';

// Multer memory storage configuration
const storage = multer.memoryStorage();

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage })) // Using memoryStorage for buffer
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, // Multer provides metadata directly
    @GetCurrentUser() currentUser: UserInstance,
  ) {
    await this.filesService.handleFileUpload(file, currentUser);

    return { message: 'File uploaded successfully' };
  }
}
