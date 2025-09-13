import { HttpService } from "@nestjs/axios";
import { Scope } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { ConfigService } from "@nestjs/config";
import { CamundaProductService } from "./services/camunda.product.service";
import { InMemoryProductsService } from "./services/inmemory.product.service";
import { IProductService } from "./services/iproduct.service";
import { RelayProductService } from "./services/relay.product.service";
import { AppLogger } from "../app/logger/app.logger";
import { ContextLogger } from "../app/logger/context.logger";

@Injectable({ scope: Scope.REQUEST })
export class ProductServiceFactory {

    private mode = ""

    private singletonService: IProductService | undefined;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger,
        private readonly contextLogger: ContextLogger) {
            if (this.config === undefined) {
                throw new Error('ConfigService is undefined');
            }
            this.logger.debug(JSON.stringify(this.config))
            this.mode = this.config.get('apiSettings.mode');
            this.logger.debug('Mode: ' + this.mode);
        }

    createProductService(): IProductService {
        if (this.singletonService !== undefined) {
            this.logger.verbose('Using singleton ProductService');
            return this.singletonService;
        }

        // Add an interceptor to the httpService to add the trackingId and the transtionId to the request
        this.httpService.axiosRef.interceptors.request.use(config => {
            this.logger.verbose('Adding trackingId and transactionId to request', { axiosTrackingId: this.contextLogger.trackingId, axiosTransactionId: this.contextLogger.transationId });
            config.headers['X-TrackingId'] = this.contextLogger.trackingId;
            config.headers['X-TransactionId'] = this.contextLogger.transationId;
            return config;
        });

        if (this.mode === 'camunda') {
            this.logger.verbose('Using CamundaProductService');
            this.singletonService = new CamundaProductService(this.httpService, this.config, this.logger);
        } else if (this.mode === 'relay') {
            this.logger.verbose('Using RelayProductService');
            this.singletonService = new RelayProductService(this.httpService, this.config, this.logger);  
        } else {
            this.logger.verbose('Using InMemoryProductsService');
            this.singletonService = new InMemoryProductsService();
        }

        return this.singletonService;
    }
}
