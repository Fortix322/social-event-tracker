import { Controller, Body, Post, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { baseEventValidationPipe } from './pipes/baseEventValidation/baseEventValidation.pipe';
import { BaseEvent } from './common/schemas/baseEvent.schema';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async postEvent(@Body('event', baseEventValidationPipe) event: BaseEvent) {

    if(!await this.appService.publishEvent(event))
    {
      throw new InternalServerErrorException();
    }
  }
}
