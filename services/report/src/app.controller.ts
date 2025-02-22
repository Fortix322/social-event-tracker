import { Controller, Get, NotImplementedException } from '@nestjs/common';

@Controller("reports")
export class AppController {
  constructor() {}

  @Get("events")
  async getEventsReport() {

    throw new NotImplementedException;
  }

  @Get("revenue")
  async getRevenueReport() {

    throw new NotImplementedException;
  }

  @Get("revenue")
  async  getDemographicsReport() {

    throw new NotImplementedException;
  }
}
