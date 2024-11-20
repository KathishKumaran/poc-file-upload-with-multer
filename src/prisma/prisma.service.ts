import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import {
  Inject,
  Injectable,
  forwardRef,
  OnModuleInit,
  OnModuleDestroy,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MODEL } from 'src/config/constants';
import { UserModel } from 'src/models/user/user.model';
import { FileModel } from 'src/models/file/file.model';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    config: ConfigService,
    private fileModel: FileModel,
    @Inject(forwardRef(() => UserModel)) private userModel: UserModel,
  ) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.main();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async main() {
    this.$use(async (params, next) => {
      if (params.model === 'User') {
        if (params.action === 'create') {
          try {
            await this.userModel.user.validateAsync(params.args?.data, {
              errors: { label: false },
            });
          } catch (err) {
            throw new UnprocessableEntityException(err);
          }
        }
        if (params.action === 'update') {
          try {
            await this.userModel.user.validateAsync(params.args?.data, {
              externals: false,
            });
          } catch (err) {
            throw new UnprocessableEntityException(err);
          }
        }
      }

      if (params.model === 'File') {
        if (params.action === 'create' || params.action === 'update') {
          try {
            await this.fileModel.file.validateAsync(params.args?.data);
          } catch (err) {
            throw new UnprocessableEntityException(err);
          }
        }
      }

      if (MODEL.includes(params.model)) {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { deleted_at: new Date() };
        }
        if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args['data'] = { deleted_at: new Date() };
          } else {
            params.args['data'] = { deleted_at: new Date() };
          }
        }
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args.where['deleted_at'] = null;
        }
        if (params.action === 'aggregate') {
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              params.args.where['deleted_at'] = null;
            }
          } else {
            params.args['where'] = { deleted_at: null };
          }
        }
        if (params.action === 'findMany') {
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              params.args.where['deleted_at'] = null;
            }
          } else {
            params.args['where'] = { deleted_at: null };
          }
        }
      }
      return next(params);
    });
  }
}
