import { HttpService } from "@nestjs/axios";
import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { ConfigService } from "@nestjs/config";
import { CamundaProductService } from "./services/camunda.product.service";
import { InMemoryProductsService } from "./services/inmemory.product.service";
import { IProductService } from "./services/iproduct.service";

@Injectable()
export class ProductServiceFactory {

    private mode = ""

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: Logger) {
            if (this.config === undefined) {
                throw new Error('ConfigService is undefined');
            }
            this.logger.debug(JSON.stringify(this.config))
            this.mode = this.config.get('apiSettings.mode');
            this.logger.debug('Mode: ' + this.mode);
        }

    createProductService(): IProductService {
        if (this.mode === 'camunda') {
            this.logger.verbose('Using CamundaProductService');
            return new CamundaProductService(this.httpService, this.config, this.logger);
        } else {
            this.logger.verbose('Using InMemoryProductsService');
            return new InMemoryProductsService();
        }
    }
}
