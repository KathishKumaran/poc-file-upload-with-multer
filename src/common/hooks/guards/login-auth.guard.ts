import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';


declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}


@Injectable()
export class JwtAuthGuard extends AuthGuard('login') {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  async handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    if (err || !user) throw new UnauthorizedException('Invalid access token');
    const token = this.getHeaderFromRequest(context);
    if (user && user.access_token !== token) {
      throw new UnauthorizedException('Session expired');
    }
    const response = context.switchToHttp().getResponse();
    response.header('Authorization', `Bearer ${token}`);
    return user;
  }

  getHeaderFromRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request['headers']['authorization'].split(' ')[1];
    return token;
  }
}
