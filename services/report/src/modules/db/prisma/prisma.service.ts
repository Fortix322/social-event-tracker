import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  public async onModuleInit() {
    try {

      await this.$connect();
      Logger.log("Connected to db");
    }
    catch(error) {
      Logger.error("Couldn't establish connection to db", error);
      throw error;
    }
  }
}