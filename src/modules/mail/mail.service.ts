import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendFileUploadedMail(email: string) {
    await this.mailerService.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'File Upload Confirmation',
      text: 'You have successfully uploaded a file.',
    });
  }
}
