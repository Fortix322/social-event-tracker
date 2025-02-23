import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/config.service';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const configService = app.get(EnvConfigService);
  const port = configService.get('PORT');
  const logsPath = configService.get('LOGS_PATH');
  const serviceName = configService.get('SERVICE_NAME');

  app.useLogger(WinstonModule.createLogger({
    transports: [
      new transports.File({
        filename: logsPath + '/error.log',
        level: 'error',
        format: format.combine(
          format.cli(),
          format.splat(),
          format.uncolorize(),
          format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          format.printf((info) => `[${serviceName}]-${info.level} ${info.timestamp}}: ${info.message}   ${info.stack ?? ""}`))
        }
      ),
      new transports.Console({
        format: format.combine(
          format.cli(),
          format.splat(),
          format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          format.printf((info) => `[${serviceName}]-${info.level} ${info.timestamp}}: ${info.message}   ${info.stack ?? ""}`))
      })
    ]
  }));

  await app.listen(port);
  Logger.log(`App is up and running on port: ${port}`);
}
bootstrap();
