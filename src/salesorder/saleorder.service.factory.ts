import { HttpService } from "@nestjs/axios";
import { Scope } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { ConfigService } from "@nestjs/config";
import { ISaleOrderService } from "./services/isaleorder.service";
import { AppLogger } from "src/app/logger/app.logger";
import { ContextLogger } from "src/app/logger/context.logger";
import { AccessTokenService } from "src/businesscentral/access-token.service";
import { BusinessCentralSaleOrderService } from "./services/businesscentral.saleorder.service";

@Injectable({ scope: Scope.REQUEST })
export class SaleOrderServiceFactory {

    private readonly mode: string = "";

    private singletonService: ISaleOrderService | undefined;

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

    createSaleOrderService(): ISaleOrderService {
        if (this.singletonService !== undefined) {
            this.logger.verbose('Using singleton SaleOrderService');
            return this.singletonService;
        }

        // Add an interceptor to the httpService to add the trackingId and the transtionId to the request
        this.httpService.axiosRef.interceptors.request.use(config => {
            this.logger.verbose('Adding trackingId and transactionId to request', { axiosTrackingId: this.contextLogger.trackingId, axiosTransactionId: this.contextLogger.transationId });
            config.headers['X-TrackingId'] = this.contextLogger.trackingId;
            config.headers['X-TransactionId'] = this.contextLogger.transationId;
            return config;
        });

        this.logger.verbose('Using BusinessCentralSaleOrderService');
        this.singletonService = new BusinessCentralSaleOrderService(this.httpService, this.config, this.logger, new AccessTokenService(this.config, this.httpService, this.logger));

        return this.singletonService;
    }
}
