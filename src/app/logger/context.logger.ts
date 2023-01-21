import { Injectable, Scope } from "@nestjs/common"

@Injectable({ scope: Scope.REQUEST })
export class ContextLogger {
    constructor() {
        this.trackingId = ""
        this.transationId = ""
    }

    trackingId: string
    transationId: string
}