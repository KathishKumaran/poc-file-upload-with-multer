import * as dotenv from 'dotenv';
dotenv.config();

import { useContainer } from 'class-validator';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/hooks/guards/login-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOption } from './config/swagger-options';
import corsOptions from './config/cors-options';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.enableCors(corsOptions(process.env.FRONTEND_DOMAIN));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const reflector = new Reflector();
  const prismaService = app.get(PrismaService);
  app.useGlobalGuards(new JwtAuthGuard(reflector, prismaService));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
