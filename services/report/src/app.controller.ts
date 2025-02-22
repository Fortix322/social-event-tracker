import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ReportsService } from './modules/db/reports/reports.service';

@Controller("reports")
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly reportsService: ReportsService
  ) {}

  @Get("events")
  async getHello(): Promise<any> {
    return await this.reportsService.getEventsReport({from: new Date("2025-02-21"), to: new Date("2025-02-21")});
  }
}
