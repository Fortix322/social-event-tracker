import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/config.service';
import { urlencoded } from 'express';
import { json } from 'express';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const configService = app.get(EnvConfigService);
  const port = configService.get('PORT');
  const sizeLimit = configService.get('BODY_SIZE_LIMIT');
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
          format.errors({ stack: true }),
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
          format.errors({ stack: true }),
          format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
          format.printf((info) => `[${serviceName}]-${info.level} ${info.timestamp}}: ${info.message}  ${info.stack ?? ""}`))
      })
    ]
  }));

  app.use(json({limit: sizeLimit}));
  app.use(urlencoded({limit: sizeLimit, extended: true}));

  
  await app.listen(port);
  Logger.log(`App is up and running on port: ${port}`);
}
bootstrap();
