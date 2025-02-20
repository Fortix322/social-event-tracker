import { Injectable } from '@nestjs/common';
import { NatsCollectorService } from './modules/nats/natsCollector.service';
import { EnvConfigService } from './config/config.service';
import { AckPolicy, JsMsg, RetentionPolicy, StringCodec } from 'nats';
import { EventService } from './common/db/event.service';

const MAX_MESSAGES = 1;

@Injectable()
export class AppService {

  constructor(private readonly natsService: NatsCollectorService,
    private readonly configService: EnvConfigService) {}

  public async onModuleInit() {

    const stream = this.configService.get("NATS_STREAM_NAME_EVENT");
    const consumer = this.configService.get("NATS_CONSUMER_NAME_EVENT");
    const subject = this.configService.get("NATS_SUBJECT_NAME_EVENT");
    const source = this.configService.get("SOURCE_EVENT");

    await this.natsService.createStreamIfNotExist({name: stream, subjects: [`${subject}.*`], retention: RetentionPolicy.Workqueue});
    await this.natsService.createConsumerIfNotExist(stream, {durable_name: consumer, filter_subject: `${subject}.${source}`, ack_policy: AckPolicy.Explicit});

    await this.natsService.listen(stream, consumer, {max_messages: MAX_MESSAGES, callback: this.handleEvents});
  }

  private handleEvents(msg: JsMsg) {

    const sc = StringCodec();
    const decoded = JSON.parse(sc.decode(msg.data));
    console.log(decoded);
    msg.ack();
  }

}
