import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvVars } from "../common/schemas/config.schema";

@Injectable()
export class EnvConfigService {

    constructor(private readonly configService: ConfigService<EnvVars, true>) {}

    get<T extends keyof EnvVars>(key: T) {
        return this.configService.get(key, {infer: true});
    }
}