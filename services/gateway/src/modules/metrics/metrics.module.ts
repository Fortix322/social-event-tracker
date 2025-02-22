import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { EnvConfigModule } from 'src/config/config.module';
import { MetricsService } from './metrics.service';

@Module({
  imports: [PrometheusModule.register(), EnvConfigModule],
  providers: [MetricsService],
  exports: [MetricsService]
})
export class MetricsModule {}
