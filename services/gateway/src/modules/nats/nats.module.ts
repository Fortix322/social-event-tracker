import { Module } from "@nestjs/common";
import { NatsService } from "./nats.service"
import { EnvConfigModule } from "src/config/config.module";
import { MetricsModule } from "../metrics/metrics.module";

@Module({
    imports: [EnvConfigModule],
    providers: [NatsService],
    exports: [NatsService]
})
export class NatsModule {}