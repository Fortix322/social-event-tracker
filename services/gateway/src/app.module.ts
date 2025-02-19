import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './modules/metrics/metrics.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigModule } from './config/config.module';
import { NatsModule } from './modules/nats/nats.module';

import { envSchema } from './config/config.scheme';

@Module({
  imports: [MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env)
    }),
    EnvConfigModule,
    NatsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
