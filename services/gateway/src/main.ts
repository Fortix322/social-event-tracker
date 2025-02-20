import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/config.service';
import { urlencoded } from 'express';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvConfigService);
  const port = configService.get('PORT');
  const sizeLimit = configService.get('BODY_SIZE_LIMIT');

  app.use(json({limit: sizeLimit}));
  app.use(urlencoded({limit: sizeLimit, extended: true}));

  
  await app.listen(port);
}
bootstrap();
