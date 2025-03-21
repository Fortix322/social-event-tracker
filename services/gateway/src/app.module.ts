import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './modules/metrics/metrics.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigModule } from './config/config.module';
import { NatsModule } from './modules/nats/nats.module';
import { RequestTrackerModule } from './modules/requestTracker/requestTracker.module';

import { envSchema } from './common/schemas/config.schema';

@Module({
  imports: [RequestTrackerModule,
    MetricsModule,
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
