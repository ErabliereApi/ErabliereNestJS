import { HttpService } from "@nestjs/axios";
import { ItemVariantData } from "../product.data.model";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";
import { ConfigService } from "@nestjs/config";
import { AppLogger } from "src/app/logger/app.logger";
import { AccessTokenService } from "src/businesscentral/access-token.service";
import { firstValueFrom } from "rxjs";
import Stream from "stream";

export class BusinessCentralProductService implements IProductService {
    constructor(private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger,
        private readonly accessTokenService: AccessTokenService) {
    }
    async getProductPicture(id: string): Promise<Stream> {
        const token = await this.accessTokenService.getAccessToken();

        const url = this.config.get<string>("businessCentral.url") + "/" +
            this.config.get<string>('businessCentral.tenantId') +
            "/production/api/v2.0/items(" + id + ")/picture/pictureContent";
        const response = await firstValueFrom(this.httpService.get<Stream>(url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/octet-stream"
                },
                responseType: 'stream'
            }
        ));
        if (response.status !== 200) {
            this.logger.error(`Failed to fetch products: ${response.statusText}`);
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        this.logger.log(`Fetched image from Business Central.`);
        return response.data;
    }

    async getProducts(): Promise<Product[]> {
        const token = await this.accessTokenService.getAccessToken();

        const url = this.config.get<string>("businessCentral.url") + "/" +
            this.config.get<string>('businessCentral.tenantId') +
            "/production/api/v2.0/items";
        const response = await firstValueFrom(this.httpService.get<any>(url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        ));
        if (response.status !== 200) {
            this.logger.error(`Failed to fetch products: ${response.statusText}`);
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        this.logger.log(`Fetched ${response.data.length} products from Business Central.`);
        return response.data.value.map(prod => {
            return {
                id: prod.id,
                title: prod.displayName,
                description: prod.number,
                price: prod.unitPrice,
                itemVariants: prod.itemVariants?.map(variant => {
                    return {
                        color: variant.color,
                        size: variant.size,
                    } as ItemVariantData;
                })
            } as Product;
        });
    }
    async getProduct(id: string): Promise<Product | null> {
        const token = await this.accessTokenService.getAccessToken();

        const url = this.config.get<string>("businessCentral.url") + "/" +
            this.config.get<string>('businessCentral.tenantId') +
            "/production/api/v2.0/items(" + id + ")";
        const response = await firstValueFrom(this.httpService.get<any>(url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        ));
        if (response.status !== 200) {
            this.logger.error(`Failed to fetch products: ${response.statusText}`);
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        this.logger.log(`Fetched 1 product from Business Central.`);
        const item = response.data;
        return {
            id: item.id,
            title: item.displayName,
            description: item.number,
            price: item.unitPrice,
            itemVariants: item.itemVariants?.map(variant => {
                return {
                    color: variant.color,
                    size: variant.size,
                } as ItemVariantData;
            })
        } as Product;
    }
    insertProduct(title: string, description: string, price: number, itemVariants: ItemVariantData[]): Promise<string> {
        throw new Error("Method not implemented.");
    }
    addImagesToProduct(id: string, imagePaths: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    deleteProduct(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}