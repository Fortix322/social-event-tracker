import { Module } from "@nestjs/common";
import { NatsCollectorService } from "./natsCollector.service"
import { EnvConfigModule } from "src/config/config.module";

@Module({
    imports: [EnvConfigModule],
    providers: [NatsCollectorService],
    exports: [NatsCollectorService]
})
export class NatsCollectorModule {}