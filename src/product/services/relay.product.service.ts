import { HttpService } from "@nestjs/axios";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";
import { ConfigService } from "@nestjs/config";
import { AppLogger } from "src/app/logger/app.logger";
import { firstValueFrom } from "rxjs";

export class RelayProductService implements IProductService {

    private readonly relayUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger
    ) {
        this.relayUrl = this.config.get('apiSettings.relayUrl');
    }
    addImagesToProduct(id: string, imagePaths: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getProducts(): Promise<Product[]> {
        const response = await firstValueFrom(this.httpService.get<Product[]>(this.relayUrl + '/products'));
        return response.data;
    }
    async getProduct(id: string): Promise<Product> {
        const response = await firstValueFrom(this.httpService.get<Product>(this.relayUrl + '/products/' + id))
        return response.data;
    }
    async insertProduct(title: string, description: string, price: number): Promise<string> {
        const response = await firstValueFrom(this.httpService.post(this.relayUrl + '/products', {
            title: title,
            description: description,
            price: price
        }))
        return response.data.id;
    }
    async updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Promise<Product> {
        const response = await firstValueFrom(this.httpService.patch(this.relayUrl + '/products', {
            id: id,
            title: prodTitle,
            description: prodDescription,
            price: prodPrice
        }))
        return response.data;
    }
    async deleteProduct(id: string): Promise<void> {
        await firstValueFrom(this.httpService.delete(this.relayUrl + '/products/' + id))
    }

}