import { Injectable } from "@nestjs/common";
import { ApiError, ConnectionOptions, ConsumeOptions, ConsumerConfig, ConsumerMessages, ErrorCode, JetStreamClient, JetStreamManager, NatsConnection, StreamConfig, Subscription, SubscriptionOptions, connect, consumerOpts } from "nats";
import { EnvConfigService } from "src/config/config.service";

const CONSUMER_ERROR_MSG = "Consumer is not exists.";

@Injectable()
export class NatsCollectorService {
    
    private connection: NatsConnection;
    private msgs: ConsumerMessages;
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
        
        if(this.msgs) {
            await this.msgs.close();
        }

        if(this.connection) {
            await this.connection.flush();
            await this.connection.close();
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
            throw new Error(CONSUMER_ERROR_MSG);
        }
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

    public async createConsumerIfNotExist(stream: string, options: Partial<ConsumerConfig>) {

        try {
            await this.jsm.consumers.info(stream, options.durable_name as string);
        }
        catch(error) {
            const apiError = error as ApiError

            if(apiError.code && apiError.code.toString() === ErrorCode.JetStream404NoMessages) {
                return this.jsm.consumers.add(stream, options);
            }

            throw error;
        }
    }
}