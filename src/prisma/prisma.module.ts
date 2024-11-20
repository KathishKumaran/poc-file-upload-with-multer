import { Global, Module, forwardRef } from '@nestjs/common';
import { FileModelModule } from 'src/models/file/file.model';
import { UserModelModule } from 'src/models/user/user.model';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [forwardRef(() => UserModelModule), FileModelModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
