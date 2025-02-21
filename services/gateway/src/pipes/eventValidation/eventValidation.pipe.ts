import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Event, eventSchema } from "event-types";

@Injectable()
export class EventValidationPipe implements PipeTransform {

    public transform(value: Event[]) {
        try {
            const events = Array.from(value);
            const validatedEvents: Event[] = [];

            events.forEach((item) => {
                const res = eventSchema.safeParse(item);
                if(res.success) 
                    validatedEvents.push(res.data);
            })

            return validatedEvents;
        }
        catch(error) {
            const nodeError = error as NodeJS.ErrnoException;
            throw new BadRequestException(`${nodeError.message}`);
        }
    }
}