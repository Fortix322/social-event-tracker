import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Source, FunnelStage } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getEventsReport(params: {
    from: Date;
    to: Date;
    source?: Source;
    funnelStage?: FunnelStage;
    eventType?: string;
  }) {
    const { from, to, source, funnelStage, eventType } = params;

    return this.prismaService.event.groupBy({
      by: ['eventType'],
      where: {
        timestamp: {
          gte: from,
          lte: to,
        },
        ...(source && { source }),
        ...(funnelStage && { funnelStage }),
        ...(eventType && { eventType }),
      },
      _count: {
        _all: true,
      },
    });
  }

  public async getRevenueReport(params: {
    from: Date;
    to: Date;
    source: Source;
    campaignId?: string;
  }) {
    const { from, to, source, campaignId } = params;

    switch(source) {
      case Source.facebook:
        return await this.prismaService.facebookEngagement.aggregate({
          where: {
            purchaseAmount: { not: null },
            event: {
              source: source,
              funnelStage: FunnelStage.bottom,
              timestamp: {
                gte: from,
                lte: to,
              },
              ...(campaignId && { facebookEngagement: { campaignId } }),
            },
          },
          _sum: {
            purchaseAmount: true,
          },
        });
      
      case Source.tiktok:
        return await this.prismaService.tiktokEngagement.aggregate({
          where: {
            purchaseAmount: { not: null },
            event: {
              source: source,
              funnelStage: 'bottom',
              timestamp: {
                gte: from,
                lte: to,
              },
            },
          },
          _sum: {
            purchaseAmount: true,
          },
        });
    }
    
  }

  public async getDemographicsReport(params: {
    from: Date;
    to: Date;
    source: Source;
  }) {
    const { from, to, source } = params;

    switch(source) {
      case Source.facebook:
        return this.prismaService.facebookUser.findMany({
          where: {
            events: {
              some: {
                source: source,
                timestamp: {
                  gte: from,
                  lte: to,
                },
              },
            },
          },
        });
      
      case Source.tiktok:
        return this.prismaService.tiktokUser.findMany({
          where: {
            events: {
              some: {
                source: 'tiktok',
                timestamp: {
                  gte: from,
                  lte: to,
                },
              },
            },
          }
        });
    }
  }
}