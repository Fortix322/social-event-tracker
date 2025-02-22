import { Injectable, Logger } from "@nestjs/common";
import { ApiError, ConnectionOptions, ErrorCode, JetStreamClient, 
    JetStreamManager, NatsConnection, PubAck, StreamConfig, StringCodec, connect } from "nats";
import { EnvConfigService } from "src/config/config.service";
import { MetricsService } from "../metrics/metrics.service";

@Injectable()
export class NatsService {
    
    private connection: NatsConnection;
    private jsm: JetStreamManager;
    private jsc: JetStreamClient;

    private readonly connectionOptions: ConnectionOptions; 

    constructor(private readonly configService: EnvConfigService,
        private readonly metricsService: MetricsService
    ) {

        this.connectionOptions = {
            servers: [this.configService.get('NATS_SERVER')],
            reconnect: true,
            maxReconnectAttempts: -1
        };
    }

    public async onModuleInit() {

        try {
            
            this.connection = await connect(this.connectionOptions);
    
            this.jsm = await this.connection.jetstreamManager();
    
            this.jsc = this.connection.jetstream();

            Logger.debug("Connected to NATS server");
        }
        catch(error) {
            Logger.error("Connection to NATS server failed", error);
        }
    }

    public async onModuleDestroy() {

        await this.connection.close();
    }

    public async createStreamIfNotExist(options: Partial<StreamConfig>) {

        try {
            await this.jsm.streams.info(options.name as string);
            Logger.debug(`Stream ${options.name} exists`);
        }
        catch(error) {
            const apiError = error as ApiError

            if(apiError.code && apiError.code.toString() === ErrorCode.JetStream404NoMessages) {
                Logger.debug(`Stream ${options.name} created`);
                return this.jsm.streams.add(options);
            }

            Logger.error("Stream creation failed", error);
            throw error;
        }
    }

    public async publishMessage(subject: string, data: any): Promise<PubAck> {

        try {
            const sc = StringCodec();
            const payload = sc.encode(JSON.stringify(data));
            const pubAck = this.jsc.publish(subject, payload);
            this.metricsService.incrementProcessedEventsCounter();

            return pubAck;
        }
        catch(error) {

            Logger.error("Failed publishing message", error);
            throw error;
        }
    }
}