import { Injectable } from "@nestjs/common";
import { Counter, register } from "prom-client";
import { EnvConfigService } from "src/config/config.service";

@Injectable()
export class MetricsService {

    private readonly receivedEvents = new Counter({
        name: "collector_received_events_count",
        help: "Total number of successfuly received events"
    });

    private readonly processedEvents = new Counter({
        name: "collector_processed_events_count",
        help: "Total number of successfuly processed events"
    });

    private readonly failedEvents = new Counter({
        name: "collector_failed_events_count",
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

    public incrementReceivedEventsCounter() {
        
        this.receivedEvents.inc();
    }

    public incrementProcessedEventsCounter() {
        
        this.processedEvents.inc();
    }

    public incrementFailedEventsCounter() {
        
        this.failedEvents.inc();
    }
}