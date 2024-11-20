import * as Joi from 'joi';
import { Module, Inject, forwardRef, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PASSWORD_REGEX } from 'src/config/constants';

export class UserModel {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  isEmailUnique = async (value: string) => {
    const userEmail = await this.prisma.user.findFirst({
      where: { email: value },
      select: { email: true },
    });
    if (userEmail) throw new ConflictException('Email already exists');
  };

  user = Joi.object({
    email: Joi.string()
      .min(1)
      .max(100)
      .pattern(/^[a-z0-9.]+@[a-z]+\.[a-z]{2,5}$/)
      .external(this.isEmailUnique)
      .error(new Error('Email should be in a valid format')),

    password: Joi.string()
      .pattern(new RegExp(PASSWORD_REGEX))
      .error(
        new Error(
          'Password must have at least one uppercase letter, one lowercase letter, one number, and one special character (~@$!%*?&)',
        ),
      ),

    access_token: Joi.string()
      .allow(null)
      .error(new Error('Access token must be a string')),

    created_at: Joi.date(),
    updated_at: Joi.date(),
    deleted_at: Joi.date(),
  });
}

@Module({
  providers: [UserModel],
  exports: [UserModel],
})
export class UserModelModule {}
