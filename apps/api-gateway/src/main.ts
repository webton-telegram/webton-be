import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@app/common/config/config.service';
import { Logger } from 'nestjs-pino';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';
import { setupSwagger } from '@app/common/setup-swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { formatError } from '@app/utils/utils';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const port = ConfigService.getConfig().PORT;

  app.setGlobalPrefix(ConfigService.getConfig().API_VERSION, {
    exclude: [{ path: '/health', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) =>
        new ServiceException(
          ServiceExceptionCode.BadRequest,
          HttpStatus.BAD_REQUEST,
          errors.map((e) => formatError(e)).toString(),
        ),
    }),
  );
  app.useLogger(app.get(Logger));
  if (!ConfigService.isProduction()) {
    setupSwagger(app);
  }
  await app.listen(port);
}
bootstrap();
