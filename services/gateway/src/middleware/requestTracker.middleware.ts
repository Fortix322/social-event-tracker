import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestTrackerService } from 'src/modules/requestTracker/requestTracker.service';

@Injectable()
export class RequestTrackerMiddleware implements NestMiddleware {

    constructor(private readonly requestTracker: RequestTrackerService) {}

    use(req: Request, res: Response, next: NextFunction) {

      this.requestTracker.startRequest();
    
      res.on('finish', () => this.requestTracker.endRequest());
      res.on('close', () => this.requestTracker.endRequest());
      
      next();
    }
}