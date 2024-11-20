import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginParams } from 'src/entities/session/session-request.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async getUserByEmail(userEmail: string) {
    const user = await this.findByEmail(userEmail);
    if (!user) throw new UnauthorizedException('User does not exist');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async markSignIn(user: User) {
    const time = new Date();
    const { id, email } = user;
    const { JWT_SECRET_KEY = '' } = process.env;
    const token = this.jwtService.sign(
      { id, email, time },
      { secret: JWT_SECRET_KEY },
    );
    const userUpdateAttributes = {
      access_token: token,
    };

    const userData = await this.prisma.user.update({
      where: { id },
      data: userUpdateAttributes,
    });

    return {
      userDetails: {
        id: userData.id,
        email: userData.email,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      },
      access_token: token,
    };
  }

  async signin(signinAttrs: LoginParams) {
    const currentUser = await this.getUserByEmail(signinAttrs.email);

    return await this.markSignIn(currentUser);
  }
}
