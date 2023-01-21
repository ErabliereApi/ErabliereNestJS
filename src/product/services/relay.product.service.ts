import { HttpService } from "@nestjs/axios";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { AppLogger } from "src/app/logger/app.logger";

export class RelayProductService implements IProductService {

    private readonly relayUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger
    ) {
        this.relayUrl = this.config.get('apiSettings.relayUrl');
    }

    async getProducts(): Promise<Product[]> {
        const response = await this.httpService.get<Product[]>(this.relayUrl + '/products').toPromise()
        return response.data;
    }
    async getProduct(id: string): Promise<Product> {
        const response = await this.httpService.get<Product>(this.relayUrl + '/products/' + id).toPromise()
        return response.data;
    }
    async insertProduct(title: string, description: string, price: number): Promise<string> {
        const response = await this.httpService.post(this.relayUrl + '/products', {
            title: title,
            description: description,
            price: price
        }).toPromise()
        return response.data.id;
    }
    async updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Promise<Product> {
        const response = await this.httpService.patch(this.relayUrl + '/products', {
            id: id,
            title: prodTitle,
            description: prodDescription,
            price: prodPrice
        }).toPromise()
        return response.data;
    }
    async deleteProduct(id: string): Promise<void> {
        await this.httpService.delete(this.relayUrl + '/products/' + id).toPromise()
    }

}