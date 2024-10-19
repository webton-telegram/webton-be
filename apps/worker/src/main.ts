import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { ConfigService } from '@app/common/config/config.service';
import { Logger } from 'nestjs-pino';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(WorkerModule);
  const port = ConfigService.getConfig().PORT;
  app.useLogger(app.get(Logger));
  await app.listen(port);
}
bootstrap();
