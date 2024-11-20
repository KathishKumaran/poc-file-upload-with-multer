import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import { FileService } from './file.service';
import { MailModule } from '../mail/mail.module';
import { multerConfig } from 'src/config/multer-config';
import { MulterModule } from '@nestjs/platform-express';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [MulterModule.register(multerConfig), MailModule, SocketModule],
  controllers: [FilesController],
  providers: [FileService],
})
export class FileModule {}
