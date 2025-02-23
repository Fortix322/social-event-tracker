import { Module } from "@nestjs/common";
import { RequestTrackerService } from "./requestTracker.service";

@Module({
    providers: [RequestTrackerService],
    exports: [RequestTrackerService]
})
export class RequestTrackerModule {}