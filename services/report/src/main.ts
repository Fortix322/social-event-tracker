import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvConfigService);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
