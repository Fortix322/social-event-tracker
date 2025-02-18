import { Controller, Get, Res } from "@nestjs/common";
import { Registry } from "prom-client";
import { Response } from "express";

@Controller('metrics')
export class MetricsController {

    private readonly registry: Registry;

    constructor() {
        this.registry = new Registry();
    }

    @Get()
    async getMetrics(@Res() res: Response) {
        res.set('Content-Type', this.registry.contentType);
        res.send(await this.registry.metrics());
    }
}