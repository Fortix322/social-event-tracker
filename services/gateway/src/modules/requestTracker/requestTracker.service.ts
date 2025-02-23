import { Injectable, OnApplicationShutdown, OnModuleDestroy, Logger } from "@nestjs/common";

@Injectable()
export class RequestTrackerService implements OnModuleDestroy, OnApplicationShutdown {

    private activeRequests = 0;
    private shutdownResolve: (() => void) | null = null;

    public startRequest() {
        
        this.activeRequests++;
    }

    public endRequest() {

        this.activeRequests--;
        if (this.activeRequests === 0 && this.shutdownResolve) {
          this.shutdownResolve();
        }
    }

    public async waitForRequestsToComplete() {

        if (this.activeRequests > 0) {
            Logger.log(`Waiting for ${this.activeRequests} requests to complete...`)
            await new Promise<void>((resolve) => (this.shutdownResolve = resolve));
        }
    }

    public async onModuleDestroy() {

        Logger.log('Module is being destroyed...');
        await this.waitForRequestsToComplete();
    }

    public async onApplicationShutdown(signal?: string) {
        Logger.log(`Application is shutting down due to: ${signal}`);
        await this.waitForRequestsToComplete();
    }
}