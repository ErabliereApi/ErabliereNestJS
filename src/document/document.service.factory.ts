import { Injectable, Scope } from "@nestjs/common";
import { IDocumentService } from "./services/idocument.service";
import { ConfigService } from "@nestjs/config";
import { RelayDocumentService } from "./services/relay.document.service";
import { InMemoryDocumentService } from "./services/inmemory.document.service";
import { HttpService } from "@nestjs/axios";
import { AppLogger } from "src/app/logger/app.logger";
import { ContextLogger } from "src/app/logger/context.logger";

@Injectable({ scope: Scope.REQUEST })
export class DocumentServiceFactory {   

    private mode = ""

    private singletonService: IDocumentService | undefined;

    constructor(
        private readonly httpService: HttpService, 
        private readonly config: ConfigService, 
        private readonly logger: AppLogger,
        private readonly contextLogger: ContextLogger) {
    }

    createDocumentService(): IDocumentService {
        if (this.singletonService !== undefined) {
            this.logger.verbose('Using singleton DocumentService');
            return this.singletonService;
        }

        // Add an interceptor to the httpService to add the trackingId and the transtionId to the request
        this.httpService.axiosRef.interceptors.request.use(config => {
            this.logger.verbose('Adding trackingId and transactionId to request', { axiosTrackingId: this.contextLogger.trackingId, axiosTransactionId: this.contextLogger.transationId });
            config.headers['X-TrackingId'] = this.contextLogger.trackingId;
            config.headers['X-TransactionId'] = this.contextLogger.transationId;
            return config;
        });

        if (this.mode === 'relay') {
            this.logger.verbose('Using RelayDocumentService');
            this.singletonService = new RelayDocumentService(this.httpService, this.config, this.logger);  
        } else {
            this.logger.verbose('Using InMemoryProductsService');
            this.singletonService = new InMemoryDocumentService();
        }

        return this.singletonService;
    }
}
