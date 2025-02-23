import { Injectable, Logger } from "@nestjs/common";
import { Source } from "@prisma/client";
import { FacebookEventType, FunnelStage, TiktokEventType, 
    FacebookBottomEventType, TiktokBottomEventType } from "event-types";
import { PrismaService } from "../prisma/prisma.service";

const MAX_ROWS = 1000; // to demonstrate functionality and not crash your pc)

@Injectable()
export class ReportsService {

    constructor(private readonly prismaService: PrismaService) {}

    public async getEvents(filter: {
        from: Date, 
        to: Date, 
        source: Source, 
        funnelStage: FunnelStage, 
        eventType: FacebookEventType | TiktokEventType
    }) {

        try {
            switch(filter.source) {
                case Source.facebook:
                    return await this.prismaService.facebookEvent.findMany({
                        where: {
                            funnelStage: filter.funnelStage,
                            eventType: filter.eventType,
                            timestamp: {
                                gte: filter.from,
                                lte: filter.to,
                              },
                        },
                        include: {
                          engagement: true,
                        },
                        take: MAX_ROWS

                    });
    
                case Source.tiktok:
                    return await this.prismaService.tiktokEvent.findMany({
                        where: {
                            funnelStage: filter.funnelStage,
                            eventType: filter.eventType,
                            timestamp: {
                                gte: filter.from,
                                lte: filter.to,
                              },
                        },
                        include: {
                          engagement: true,
                        },
                        take: MAX_ROWS
                    });
            }
        }
        catch(error) {

            Logger.error("Couldn't get event statistic", error);
            throw error;
        }
        
    }

    public async getRevenue(filter: {
        from: Date,
        to: Date,
        source: Source,
        campaignId?: string
    }) {
        try {

            const facebookEventType: FacebookBottomEventType = "checkout.complete";
            const tiktokEventType: TiktokBottomEventType = "purchase";
    
            switch(filter.source) {
                case Source.facebook:
                    return await this.prismaService.facebookEngagement.aggregate({
                        _sum: {
                          purchaseAmount: true,
                        },
                        where: {
                          ...(filter.campaignId && {campaignId: filter.campaignId}),
                          FacebookEvent: {
                            some: {
                                eventType: facebookEventType
                            }
                          }
                        }
                    });
    
                case Source.tiktok:
                    return await this.prismaService.tiktokEngagement.aggregate({
                        _sum: {
                          purchaseAmount: true,
                        },
                        where: {
                          TiktokEvent: {
                            some: {
                              eventType: tiktokEventType,
                            },
                          },
                        },
                    });
            }
        }
        catch(error) {

            Logger.error("Couldn't get revenue statistic", error);
            throw error;
        }
    }

    public async getDemographics(filter: {
        from: Date,
        to: Date,
        source: Source
    }) {
        
        try {

            switch(filter.source) {
                case Source.facebook:
                    return await this.prismaService.facebookEvent.findMany({
                        select: {
                            user: {
                                select: {
                                    age: true,
                                    gender: true,
                                    location: true,
                                },
                            },
                        },
                        take: MAX_ROWS
                    });
    
                case Source.tiktok:
                    return await this.prismaService.tiktokEvent.findMany({
                        select: {
                            user: {
                                select: {
                                    username: true,
                                    followers: true
                                },
                            },
                        },
                        take: MAX_ROWS
                    });
            }
        }
        catch(error) {

            Logger.error("Couldn't get demographic statistic", error);
            throw error;
        }
    }
}