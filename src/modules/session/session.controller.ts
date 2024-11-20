import { FastifyReply, FastifyRequest } from 'fastify';

import { Public } from 'src/common/decorators';
import { SessionService } from './session.service';

import {
  Req,
  Res,
  Post,
  Body,
  Header,
  HttpStatus,
  Controller,
} from '@nestjs/common';

import {
  ApiTags,
  ApiResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { errorOpts } from 'src/entities/shared-schema/error.schema';
import { loginOpts } from 'src/entities/session/session-response.entity';
import { headerOpts } from 'src/entities/shared-schema/header.schema';
import { LoginParams } from 'src/entities/session/session-request.entity';

@ApiTags('sessions')
@ApiInternalServerErrorResponse({
  description: 'Something went wrong',
  schema: errorOpts,
})
@Controller()
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Public()
  @Post('login')
  @ApiOkResponse({
    description: 'Successfully logged in',
    schema: loginOpts,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password',
    schema: errorOpts,
  })
  @ApiResponse({
    description: 'bearer token ',
    schema: headerOpts,
  })
  @Header('Authorization', 'none')
  login(@Res() reply: FastifyReply, @Body() loginParams: LoginParams) {
    return this.sessionService
      .signin(loginParams)
      .then((user) => {
        reply.header('Authorization', `Bearer ${user.access_token}`);
        reply.code(HttpStatus.OK).send(user.userDetails);
      })
      .catch((error) => {
        reply.send(error);
      });
  }
}
