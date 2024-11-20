import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './modules/session/session.module';
import { FileModule } from './modules/file/file.module';
import { MailService } from './modules/mail/mail.service';
import { MailModule } from './modules/mail/mail.module';
import { SocketModule } from './modules/socket/socket.module';
@Module({
  imports: [
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SessionModule,
    FileModule,
    MailModule,
    SocketModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}
