import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { SocketGateway } from '../socket/socket.service';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly socketService: SocketGateway,
  ) {}

  async handleFileUpload(file: Express.Multer.File, user: User) {
    try {
      const newFile = await this.prisma.file.create({
        data: {
          userId: user.id,
          fileName: file.originalname,
        },
      });
      await this.mailService.sendFileUploadedMail(user.email);
      await this.socketService.notifyFileUpload('Uploaded successfully');

      return newFile;
    } catch (error) {
      throw new UnprocessableEntityException(
        `File upload failed: ${error.message}`,
      );
    }
  }
}
