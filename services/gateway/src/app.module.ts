import { Module } from '@nestjs/common';
import { MetricsModule } from './modules/metrics/metrics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/configuration.scheme';
import { AppConfigModule } from './config/app/config.module';

@Module({
  imports: [MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env)
    }),
    AppConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
