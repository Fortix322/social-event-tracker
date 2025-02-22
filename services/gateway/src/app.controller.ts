import { Controller, Body, Post, HttpCode, HttpStatus, InternalServerErrorException, Logger } from '@nestjs/common';
import { EventValidationPipe } from './pipes/eventValidation/eventValidation.pipe';
import { AppService } from './app.service';
import { Event } from 'event-types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async postEvent(@Body(EventValidationPipe) events: Event[]) {

    try {
      const published = await this.appService.publishEvents(events);

      Logger.debug(`Published ${published} events`);
      return `Processed ${published} events out of ${events.length}`;
    }
    catch(error) {
      Logger.error("Failed to publish events", error);
      throw InternalServerErrorException;
    }
  }
}
