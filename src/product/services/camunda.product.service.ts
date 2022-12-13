import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";

export class CamundaProductService implements IProductService {
    constructor(private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: LoggerService) {

    }
    async getProducts(): Promise<Product[]> {
        const url = this.config.get('camunda.url') + '/process-instance'

        this.logger.log('Calling [GET] ' + url);

        const processInstances = await this.httpService.get(url).toPromise();

        const products = processInstances.data.map((processInstance: any) => {
            return {
                id: processInstance.id,
                title: processInstance.businessKey,
                description: "",
                price: 0
            }
        });

        return products;
    }
    async getProduct(id: string): Promise<Product> {
        const url = this.config.get('camunda.url') + '/process-instance/' + id

        this.logger.log('Calling [GET] ' + url);

        const processInstances = await this.httpService.get(url).toPromise();

        const processInstance = processInstances.data;

        const product = {
            id: processInstance.id,
            title: processInstance.businessKey,
            description: "",
            price: 0
        };

        return product;
    }
    async insertProduct(title: string, description: string, price: number): Promise<string> {
        const url = this.config.get('camunda.url') + '/process-definition/key/' + this.config.get('camunda.processKey') + '/start'

        this.logger.log('Calling [POST] ' + url);

        const body = {
            "businessKey": title,
            "variables": {
                "title": {
                    "value": title,
                    "type": "String"
                },
                "description": {
                    "value": description,
                    "type": "String"
                },
                "price": {
                    "value": price,
                    "type": "Integer"
                }
            }
        }

        try {
            const response = await this.httpService.post(url, body).toPromise();

            return response.data.id;
        }
        catch (error) {
            this.logger.error(JSON.stringify(error));
            throw error;
        }
    }
    async updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Promise<Product> {
        return new Promise<Product>((resolve, reject) => {
            reject("Not implemented");
        });
    }
    async deleteProduct(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            reject("Not implemented");
        });
    }


}