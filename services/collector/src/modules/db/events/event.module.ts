import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [EventService],
    exports: [EventService]
})
export class EventModule {}