import { IsDate, IsEnum, IsOptional, IsString} from "class-validator";
import { Type } from "class-transformer";
import { Source } from "@prisma/client";

export class GetRevenueDto {
    @IsDate()
    @Type(() => Date)
    from: Date;
  
    @IsDate()
    @Type(() => Date)
    to: Date;
  
    @IsEnum(Source)
    source: Source;
  
    @IsString()
    @IsOptional()
    campaignId: string;
  }