import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { envSchema, EnvVars } from "../configuration.scheme";

@Injectable()
export class AppConfigService {

    constructor(private readonly configService: ConfigService<EnvVars, true>) {}

    get<T extends keyof EnvVars>(key: T) {
        return this.configService.get(key, {infer: true});
    }
}