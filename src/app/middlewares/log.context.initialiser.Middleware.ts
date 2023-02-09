import { Injectable, NestMiddleware, Scope } from "@nestjs/common";
import { ContextLogger } from "../logger/context.logger";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { AppLogger } from "../logger/app.logger";
import { ConfigService } from "@nestjs/config";

@Injectable({ scope: Scope.REQUEST })
export class LogContextInitialiserMiddleware implements NestMiddleware {

    constructor(private readonly context: ContextLogger, private readonly logger: AppLogger, private readonly config: ConfigService) {

    }

    use(req: Request, res: Response, next: (error?: any) => void) {

        // Log all headers if debug is enabled
        if (this.config.get('logger.level') === 'debug' || 
            this.config.get('logger.level') === 'verbose' ||
            this.config.get('logger.level') === 'trace') {
            this.logger.debug(`Request headers: ${JSON.stringify(req.headers)}`)
        }

        this.context.transationId = randomUUID()

        const clientTracking = req.get('X-TrackingId')

        if (clientTracking) {
            this.context.trackingId = clientTracking
        } else {
            this.logger.warn('Client did not provide tracking id')
            this.context.trackingId = randomUUID()
        }

        next()

        res.append("X-TransationId", this.context.transationId)
        res.append("X-TrackingId", this.context.trackingId)
    }

}