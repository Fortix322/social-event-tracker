import { IsDate, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { Source } from "@prisma/client";

export class GetDemographicDto {
    @IsDate()
    @Type(() => Date)
    from: Date;
  
    @IsDate()
    @Type(() => Date)
    to: Date;
  
    @IsEnum(Source)
    source: Source;
}