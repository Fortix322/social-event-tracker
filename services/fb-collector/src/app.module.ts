import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './modules/metrics/metrics.module';
import { EnvConfigModule } from './config/config.module';
import { NatsCollectorModule } from './modules/nats/natsCollector.module';

import { envSchema } from './common/schemas/config.schema';

@Module({
  imports: [MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env)
    }),
    EnvConfigModule,
    NatsCollectorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
