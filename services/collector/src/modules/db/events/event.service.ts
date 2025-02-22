import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, FacebookEngagement, FacebookUser, TiktokEngagement, TiktokUser } from 'event-types';
import { Gender, Source } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createEvent(event: Event) {

    const user = await this.createUserIfNotExists(event.source, event.data.user);

    const engagement = await this.createEngagement(event.source, event.eventId, event.data.engagement);

    switch(event.source) {
      case Source.facebook:
        return this.prismaService.facebookEvent.create({
          data: {
            eventId: event.eventId,    
            timestamp: event.timestamp,
            funnelStage: event.funnelStage,
            eventType: event.eventType,
            userId: user.userId,
          },
          include: {
            user: true,
            engagement: true
          }
        });

      case Source.tiktok:
        return this.prismaService.tiktokEvent.create({
          data: {
            eventId: event.eventId,    
            timestamp: event.timestamp,
            funnelStage: event.funnelStage,
            eventType: event.eventType,
            userId: user.userId,
          },
          include: {
            user: true,
            engagement: true
          }
        });

    }
  }

  public async createUserIfNotExists(source: Source, user: FacebookUser | TiktokUser) {

    switch(source) {
      case Source.facebook: 
        return await this.prismaService.facebookUser.upsert({
          where: { userId: user.userId },
          update: {},
          create: {
            userId: user.userId,
            name: (user as FacebookUser).name,
            age: (user as FacebookUser).age,
            gender: Gender.non_binary,
            location: (user as FacebookUser).location
          }
        });

      case Source.tiktok:
        return await this.prismaService.tiktokUser.upsert({
          where: { userId: user.userId },
          update: {},
          create: {
            userId: user.userId,
            username: (user as TiktokUser).username,
            followers: (user as TiktokUser).followers
          }
        })
    }
  }

  public async createEngagement(source: Source, eventId: string, engagement: FacebookEngagement | TiktokEngagement) {

    switch(source) {
      case Source.facebook: 
        return await this.prismaService.facebookEngagement.create({
          data: {
            eventId: eventId,
            ...engagement as FacebookEngagement
          }
        });

      case Source.tiktok:
        return await this.prismaService.tiktokEngagement.create({
          data: {
            eventId: eventId,
            ...engagement as TiktokEngagement
          }
        });
    }
  }
}