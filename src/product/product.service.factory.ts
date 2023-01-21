import { HttpService } from "@nestjs/axios";
import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { ConfigService } from "@nestjs/config";
import { CamundaProductService } from "./services/camunda.product.service";
import { InMemoryProductsService } from "./services/inmemory.product.service";
import { IProductService } from "./services/iproduct.service";
import { RelayProductService } from "./services/relay.product.service";
import { AppLogger } from "src/app/logger/app.logger";

@Injectable()
export class ProductServiceFactory {

    private mode = ""

    private singletonService: IProductService | undefined;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger) {
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

        if (this.mode === 'camunda') {
            this.logger.verbose('Using CamundaProductService');
            this.singletonService = new CamundaProductService(this.httpService, this.config, this.logger);
        } if (this.mode === 'relay') {
            this.logger.verbose('Using RelayProductService');
            this.singletonService = new RelayProductService(this.httpService, this.config, this.logger);  
        } else {
            this.logger.verbose('Using InMemoryProductsService');
            this.singletonService = new InMemoryProductsService();
        }

        return this.singletonService;
    }
}
