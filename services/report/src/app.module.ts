import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './modules/metrics/metrics.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigModule } from './config/config.module';
import { ReportsModule } from './modules/db/reports/reports.module';

import { envSchema } from './common/schemas/config.schema';

@Module({
  imports: [MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env)
    }),
    EnvConfigModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
