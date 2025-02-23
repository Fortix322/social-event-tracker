import { Injectable } from "@nestjs/common";
import { Counter, register } from "prom-client";
import { EnvConfigService } from "src/config/config.service";

@Injectable()
export class MetricsService {

    private readonly receivedEvents = new Counter({
        name: "gateway_received_events_count",
        help: "Total number of successfuly received events"
    });

    private readonly processedEvents = new Counter({
        name: "gateway_processed_events_count",
        help: "Total number of successfuly processed events"
    });

    private readonly failedEvents = new Counter({
        name: "gateway_failed_events_count",
        help: "Total number of failed events"
    });

    constructor(private readonly configService: EnvConfigService) {

        const serviceName = configService.get('SERVICE_NAME');

        register.clear();
        register.setDefaultLabels({
            app: serviceName.toLocaleLowerCase()
        })

        register.registerMetric(this.receivedEvents);
        register.registerMetric(this.processedEvents);
        register.registerMetric(this.failedEvents);
    }

    public incrementReceivedEventsCounter(count?: number) {
        
        this.receivedEvents.inc(count);
    }

    public incrementProcessedEventsCounter(count?: number) {
        
        this.processedEvents.inc(count);
    }

    public incrementFailedEventsCounter(count?: number) {
        
        this.failedEvents.inc(count);
    }
}