import { Module } from "@nestjs/common";
import { EnvConfigService } from "./config.service";

@Module({
    providers: [EnvConfigService],
    exports: [EnvConfigService]
})
export class EnvConfigModule {}