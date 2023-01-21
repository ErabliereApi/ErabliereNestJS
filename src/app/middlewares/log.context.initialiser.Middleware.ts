import { Injectable, NestMiddleware, Scope } from "@nestjs/common";
import { ContextLogger } from "../logger/context.logger";
import { randomUUID } from "crypto";
import { Request, Response } from "express";

@Injectable({ scope: Scope.REQUEST })
export class LogContextInitialiserMiddleware implements NestMiddleware {

    constructor(private readonly context: ContextLogger) {

    }

    use(req: Request, res: Response, next: (error?: any) => void) {
        this.context.transationId = randomUUID()

        const clientTracking = req.get('X-TrackingId')

        if (clientTracking) {
            this.context.trackingId = clientTracking
        } else {
            this.context.trackingId = randomUUID()
        }

        next()

        res.append("X-TransationId", this.context.transationId)
        res.append("X-TrackingId", this.context.trackingId)
    }

}