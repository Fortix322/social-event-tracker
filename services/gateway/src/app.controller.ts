import { Controller, Get } from '@nestjs/common';
import { NatsService } from './modules/nats/nats.service';

@Controller()
export class AppController {
  constructor(private readonly natsService: NatsService) {}

  @Get()
  async getHello(): Promise<string> {

    return "foo";
  }
}
