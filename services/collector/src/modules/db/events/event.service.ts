import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

    public async createEvent(data: Prisma.EventCreateInput) {

      await this.prismaService.event.create({data});
    }
}