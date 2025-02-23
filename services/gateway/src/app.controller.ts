import { Controller, Body, Post, HttpCode, HttpStatus, Logger,
  MiddlewareConsumer, Get
 } from '@nestjs/common';
import { EventValidationPipe } from './pipes/eventValidation/eventValidation.pipe';
import { AppService } from './app.service';
import { Event } from 'event-types';
import { MetricsService } from './modules/metrics/metrics.service';
import { RequestTrackerMiddleware } from './middleware/requestTracker.middleware';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly metricsService: MetricsService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTrackerMiddleware).forRoutes('*');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async postEvent(@Body(EventValidationPipe) events: Event[]) {

    const published = await this.appService.publishEvents(events);

    if(published < events.length) {
      this.metricsService.incrementFailedEventsCounter(events.length - published);
    }

    Logger.debug(`Published ${published} events`);
    return `Processed ${published} events out of ${events.length}`;
  }

  @Get("healthcheck")
  @HttpCode(HttpStatus.OK)
  getStatus() {}
}
