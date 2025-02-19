import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { baseEventSchema } from "src/common/schemas/baseEvent.schema";
import { ZodError } from "zod";

const BAD_REQUEST_MSG = "Invalid body schema";

@Injectable()
export class baseEventValidationPipe implements PipeTransform {
    public transform(value: any) {
        try {

            const parsed = baseEventSchema.parse(JSON.parse(value));
            return parsed;
        }
        catch(error) {
            const nodeError = error as NodeJS.ErrnoException;
            throw new BadRequestException(`${BAD_REQUEST_MSG}: ${nodeError.message}`);
        }
    }
}