import { Module } from "@nestjs/common";
import { NatsService } from "./nats.service"
import { EnvConfigModule } from "src/config/config.module";
import { MetricsModule } from "../metrics/metrics.module";

@Module({
    imports: [EnvConfigModule, MetricsModule],
    providers: [NatsService],
    exports: [NatsService]
})
export class NatsModule {}