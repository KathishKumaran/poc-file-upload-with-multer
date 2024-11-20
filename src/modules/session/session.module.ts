import { Module, forwardRef } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/hooks/strategies/login-auth.strategy';

@Module({
  imports: [UserModule, forwardRef(() => JwtModule.register({}))],
  providers: [JwtStrategy, SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
