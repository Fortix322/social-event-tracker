import { Controller, Body, Post, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { EventValidationPipe } from './pipes/eventValidation/eventValidation.pipe';
import { AppService } from './app.service';
import { Event } from 'event-types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async postEvent(@Body(EventValidationPipe) events: Event[]) {

    const published = await this.appService.publishEvents(events);
    if(published === 0) {
      throw new InternalServerErrorException(`Internal Server Error. Published ${published} events out of ${events.length}...`);
    }

    console.log(published);
    console.log(`Published ${published} events out of ${events.length}`);
    return `Published ${published} events out of ${events.length}`;
  }
}
