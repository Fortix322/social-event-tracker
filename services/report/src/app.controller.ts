import { Controller, Get, InternalServerErrorException, Logger,
   Query, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportsService } from './modules/db/reports/reports.service';
import { GetEventsDto } from './dto/eventReport.dto';
import { GetRevenueDto } from './dto/revenueReport.dto';
import { GetDemographicDto } from './dto/demographicReport.dto';

@Controller("reports")
export class AppController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("events")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getEventsReport(@Query() query: GetEventsDto) {

    try {
      
      return this.reportsService.getEvents({...query});
    }
    catch(error) {
      Logger.error("Couldn't get events report", error);
      throw new InternalServerErrorException();
    }
  }

  @Get("revenue")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRevenueReport(@Query() query: GetRevenueDto) {

    try {
      
      return this.reportsService.getRevenue({...query});
    }
    catch(error) {
      Logger.error("Couldn't get revenue report", error);
      throw new InternalServerErrorException();
    }
  }

  @Get("demographic")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDemographicsReport(@Query() query: GetDemographicDto) {

    try {

      return this.reportsService.getDemographics({...query});
    }
    catch(error) {
      Logger.error("Couldn't get demographic report", error);
      throw new InternalServerErrorException();
    }
  }

  @Get("healthcheck")
  @HttpCode(HttpStatus.OK)
  getStatus() {}
}
