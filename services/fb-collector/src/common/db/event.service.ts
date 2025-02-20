import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TiktokEvent, FacebookEvent, Prisma } from '@prisma/client';
import { EnvConfigService } from 'src/config/config.service';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService,
    private readonly configService: EnvConfigService
  ) {}

    public async createEvent(data: Prisma.FacebookEventCreateInput | Prisma.TiktokEventCreateInput): 
        Promise<FacebookEvent | TiktokEvent> {

        const source = this.configService.get("SOURCE_EVENT");
        
        switch(source) {
            case "facebook":
                return this.prismaService.facebookEvent.create({data: data as Prisma.FacebookEventCreateInput});
            case "tiktok":
                return this.prismaService.tiktokEvent.create({data: data as Prisma.TiktokEventCreateInput});
        }
    }
}