import { Module } from "@nestjs/common";
import { NatsTrackerService } from "./natsTracker.service";

@Module({
    providers: [NatsTrackerService],
    exports: [NatsTrackerService]
})
export class NatsTrackerModule {}