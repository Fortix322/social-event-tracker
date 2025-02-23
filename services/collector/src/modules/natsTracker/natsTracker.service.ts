import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";

@Injectable()
export class NatsTrackerService implements OnApplicationShutdown {

    private activeMessages = 0;
    private shutdownResolve: (() => void) | null = null;
    
    public startProcessing() {

        this.activeMessages++;
    }

    public endProcessing() {

        this.activeMessages--;  

        if (this.activeMessages === 0 && this.shutdownResolve) {
            this.shutdownResolve();
        }
    }

    public async waitForMessagesToComplete() {

        if (this.activeMessages > 0) {
            Logger.log(`Waiting for ${this.activeMessages} messages to complete...`);
            await new Promise<void>((resolve) => (this.shutdownResolve = resolve));
        }
    }

    public async onApplicationShutdown(signal?: string) {

        Logger.log(`Application shutting down due to: ${signal}`);
        await this.waitForMessagesToComplete();
        Logger.log(`All messages processed. Safe shutdown.`);
    }
}