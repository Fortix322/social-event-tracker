import { Injectable, Logger } from "@nestjs/common";
import { ApiError, ConnectionOptions, ConsumeOptions, ConsumerConfig, ConsumerMessages, ErrorCode, JetStreamClient, JetStreamManager, NatsConnection, StreamConfig, Subscription, SubscriptionOptions, connect, consumerOpts } from "nats";
import { EnvConfigService } from "src/config/config.service";

@Injectable()
export class NatsCollectorService {
    
    private connection: NatsConnection;
    private msgs: ConsumerMessages;
    private jsm: JetStreamManager;
    private jsc: JetStreamClient;

    private readonly connectionOptions: ConnectionOptions; 

    constructor(private readonly configService: EnvConfigService) {

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
        }
        catch(error) {
            Logger.error("Failed connection to the NATS server", error)
        }
    }

    public async onModuleDestroy() {
        
        try {

            if(this.msgs) {
                await this.msgs.close();
            }
    
            if(this.connection) {
                await this.connection.flush();
                await this.connection.close();
            }
        }
        catch(error) {
            Logger.error("Couldn't properly close NATS connection", error);
            throw error;
        }
    }

    public async listen(stream: string, consumer: string, opt: ConsumeOptions) {

        try {

            if(this.msgs) {
                await this.msgs.close();
            }

            const c = await this.jsc.consumers.get(stream, consumer);

            this.msgs = await c.consume(opt);
        } 
        catch(error) {
            Logger.error("Couldn't setting up NATS message consuming", error);
            throw error;
        }
    }

    public async createStreamIfNotExist(options: Partial<StreamConfig>) {

        try {
            await this.jsm.streams.info(options.name as string);
            Logger.debug(`Stream ${options.name} exists`);
        }
        catch(error) {
            const apiError = error as ApiError

            if(apiError.code && apiError.code.toString() === ErrorCode.JetStream404NoMessages) {
                Logger.debug(`Created stream ${options.name}`);
                return this.jsm.streams.add(options);
            }

            Logger.error("Failed creating NATS stream", error);
            throw error;
        }
    }

    public async createConsumerIfNotExist(stream: string, options: Partial<ConsumerConfig>) {

        try {
            await this.jsm.consumers.info(stream, options.durable_name as string);
            Logger.debug(`Consumer ${options.name} exists`);

        }
        catch(error) {
            const apiError = error as ApiError

            if(apiError.code && apiError.code.toString() === ErrorCode.JetStream404NoMessages) {
                Logger.debug(`Created consumer ${options.name}`);
                return this.jsm.consumers.add(stream, options);
            }

            Logger.error("Failed creating NATS consumer", error);
            throw error;
        }
    }
}