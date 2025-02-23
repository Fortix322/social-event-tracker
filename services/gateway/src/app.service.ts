import { Injectable, Logger } from '@nestjs/common';
import { EnvConfigService } from './config/config.service';
import { NatsService } from './modules/nats/nats.service';
import { Event } from 'event-types';
import { RetentionPolicy } from 'nats';
import { MetricsService } from './modules/metrics/metrics.service';

@Injectable()
export class AppService {
  
  constructor(private readonly configService: EnvConfigService,
    private readonly natsService: NatsService,
    private readonly metricsService: MetricsService
  ) {}

  public async publishEvents(events: Event[]): Promise<number>
  {
    let published = 0;

    try {
      const baseSubject = this.configService.get('NATS_SUBJECT_NAME_EVENT');

      await this.natsService.createStreamIfNotExist({
        name: this.configService.get("NATS_STREAM_NAME_EVENT"),
        subjects: [baseSubject + '.*'],
        retention: RetentionPolicy.Workqueue
      })
      
      for(const item of events) {
        await this.natsService.publishMessage(`${baseSubject}.${item.source}`, item);
        published += 1;
        this.metricsService.incrementProcessedEventsCounter();
      }
    }
    catch(error) {
      Logger.warn("Couldn't publish event", error);
      return published;
    }

    return published;
  }
}
