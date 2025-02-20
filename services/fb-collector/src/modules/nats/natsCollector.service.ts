import { Injectable } from "@nestjs/common";
import { ApiError, ConnectionOptions, ErrorCode, JetStreamClient, JetStreamManager, NatsConnection, NatsError, PubAck, ServiceErrorCodeHeader, StreamConfig, StreamInfo, StringCodec, connect } from "nats";
import { EnvConfigService } from "src/config/config.service";

@Injectable()
export class NatsCollectorService {
    
    private connection: NatsConnection;
    private jsm: JetStreamManager;
    private jsc: JetStreamClient;

    private readonly connectionOptions: ConnectionOptions; 

    constructor(private readonly configService: EnvConfigService) {

        this.connectionOptions = {
            servers: [this.configService.get('NATS_SERVER')]
        };
    }

    public async onModuleInit() {
        
        this.connection = await connect(this.connectionOptions);

        this.jsm = await this.connection.jetstreamManager();

        this.jsc = this.connection.jetstream();
    }

    public async onModuleDestroy() {

        await this.connection.close();
    }

    public async createStreamIfNotExist(options: Partial<StreamConfig>) {

        try {
            await this.jsm.streams.info(options.name as string);
        }
        catch(error) {
            const apiError = error as ApiError

            if(apiError.code && apiError.code.toString() === ErrorCode.JetStream404NoMessages) {
                return this.jsm.streams.add(options);
            }

            throw error;
        }
    }
}