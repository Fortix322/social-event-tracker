import { Injectable } from '@nestjs/common';
import { BaseEvent } from './common/schemas/baseEvent.schema';
import { EnvConfigService } from './config/config.service';
import { NatsService } from './modules/nats/nats.service';

@Injectable()
export class AppService {
  
  constructor(private readonly configService: EnvConfigService,
    private readonly natsService: NatsService
  ) {}

  public async publishEvent(event: BaseEvent): Promise<boolean>
  {
    
    try {
      const baseSubject = this.configService.get('NATS_SUBJECT_NAME_EVENT');

      await this.natsService.createStreamIfNotExist({
        name: this.configService.get("NATS_STREAM_NAME_EVENT"),
        subjects: [baseSubject + '.*']
      })
      
      await this.natsService.publishMessage(`${baseSubject}.${event.source}`, event);
    }
    catch(error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
