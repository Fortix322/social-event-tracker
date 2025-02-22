import { BadRequestException, Injectable, PipeTransform, Inject, Logger } from "@nestjs/common";
import { Event, eventSchema } from "event-types";
import { MetricsService } from "src/modules/metrics/metrics.service";

@Injectable()
export class EventValidationPipe implements PipeTransform {

    constructor(@Inject(MetricsService) private readonly metricsService: MetricsService) {}

    public transform(value: Event[]) {
        try {
            const events = Array.from(value);
            const validatedEvents: Event[] = [];

            events.forEach((item) => {
                const res = eventSchema.safeParse(item);
                if(res.success) {
                    validatedEvents.push(res.data);
                    this.metricsService.incrementReceivedEventsCounter();
                }
                else {
                    this.metricsService.incrementFailedEventsCounter();
                }
            })

            Logger.debug(`Received ${validatedEvents.length} validated events`);
            return validatedEvents;
        }
        catch(error) {
            
            const nodeError = error as NodeJS.ErrnoException;
            Logger.error("Couldn't validate received events", error);
            throw new BadRequestException(`${nodeError.message}`);
        }
    }
}