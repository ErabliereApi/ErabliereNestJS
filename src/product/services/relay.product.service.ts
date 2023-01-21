import { HttpService } from "@nestjs/axios";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { AppLogger } from "src/app/logger/app.logger";

export class RelayProductService implements IProductService {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger
    ) {
    }

    getProducts(): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    getProduct(id: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    insertProduct(title: string, description: string, price: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
    updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    deleteProduct(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}