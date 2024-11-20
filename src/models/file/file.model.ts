import * as Joi from 'joi';
import { Module, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class FileModel {
  file = Joi.object({
    userId: Joi.number(),

    fileName: Joi.string()
      .max(255)
      .required()
      .error(new Error('File name must be a valid string')),

    created_at: Joi.date(),
    updated_at: Joi.date(),
    deleted_at: Joi.date(),
  });
}

@Module({
  providers: [FileModel],
  exports: [FileModel],
})
export class FileModelModule {}
