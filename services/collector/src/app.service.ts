import { Injectable, Logger } from '@nestjs/common';
import { NatsCollectorService } from './modules/nats/natsCollector.service';
import { EnvConfigService } from './config/config.service';
import { AckPolicy, JsMsg, RetentionPolicy, StringCodec } from 'nats';
import { EventService } from './modules/db/events/event.service';
import { MetricsService } from './modules/metrics/metrics.service';
import { Event } from 'event-types';
import { NatsTrackerService } from './modules/natsTracker/natsTracker.service';

const MAX_MESSAGES = 50;

@Injectable()
export class AppService {

  constructor(private readonly natsService: NatsCollectorService,
    private readonly configService: EnvConfigService,
    private readonly eventService: EventService,
    private readonly metricsService: MetricsService,
    private readonly natsTracker: NatsTrackerService) {}

  public async onModuleInit() {

    const stream = this.configService.get("NATS_STREAM_NAME_EVENT");
    const consumer = this.configService.get("NATS_CONSUMER_NAME_EVENT");
    const subject = this.configService.get("NATS_SUBJECT_NAME_EVENT");
    const source = this.configService.get("SOURCE_EVENT");

    try {
      await this.natsService.createStreamIfNotExist({name: stream, subjects: [`${subject}.*`], retention: RetentionPolicy.Workqueue});
      await this.natsService.createConsumerIfNotExist(stream, {durable_name: consumer, filter_subject: `${subject}.${source}`, ack_policy: AckPolicy.Explicit});

      await this.natsService.listen(stream, consumer, {max_messages: MAX_MESSAGES, callback: this.handleEvents.bind(this)});
    }
    catch(error) {

      Logger.error("Couldn't establish listening on NATS server", error);
      throw error
    }

  }

  private handleEvents(msg: JsMsg) {

    this.metricsService.incrementReceivedEventsCounter();
    this.natsTracker.startProcessing();
    let decoded: Event;
    try {
      const sc = StringCodec();
      decoded = JSON.parse(sc.decode(msg.data));

      this.eventService.createEvent(decoded)
        .then(() =>{
          this.metricsService.incrementProcessedEventsCounter();
          msg.ack()
        })
        .catch(error => { 
          this.metricsService.incrementFailedEventsCounter();
          Logger.warn("Couldn't save event into db", error);
          msg.term();
        });

      this.natsTracker.endProcessing();
    }
    catch(error) {
      this.metricsService.incrementFailedEventsCounter();
      Logger.warn("Failed decoding message", error);
      this.natsTracker.endProcessing();
      msg.term();
    }
  }
}
