import { IsDate, IsEnum, IsString} from "class-validator";
import { Type } from "class-transformer";
import { Source, FunnelStage } from "@prisma/client";
import { FacebookEventType, TiktokEventType } from "event-types";

export class GetEventsDto {
    @IsDate()
    @Type(() => Date)
    from: Date;
  
    @IsDate()
    @Type(() => Date)
    to: Date;
  
    @IsEnum(Source)
    source: Source;
  
    @IsEnum(FunnelStage)
    funnelStage: FunnelStage;
  
    @IsString()
    eventType: FacebookEventType | TiktokEventType;
  }