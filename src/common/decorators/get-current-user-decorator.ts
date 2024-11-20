import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInstance } from 'src/modules/user/user.dto';


export const GetCurrentUser = createParamDecorator(
  (
    property: string | undefined,
    context: ExecutionContext,
  ): UserInstance | string => {
    const request = context.switchToHttp().getRequest();

    if (!property) return request.user;

    return request.user[property];
  },
);
