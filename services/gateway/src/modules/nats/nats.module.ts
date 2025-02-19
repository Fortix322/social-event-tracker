import { Module } from "@nestjs/common";
import { NatsService } from "./nats.service"
import { EnvConfigModule } from "src/config/config.module";

@Module({
    imports: [EnvConfigModule],
    providers: [NatsService],
    exports: [NatsService]
})
export class NatsModule {}