import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";
import { randomUUID } from "crypto";

@Injectable()
export class InMemoryProductsService implements IProductService {
    
    private static products: Product[] = [];

    getProducts(): Promise<Product[]> {
        return new Promise(resolve => resolve([ ...InMemoryProductsService.products ]))
    }

    getProduct(id: string): Promise<Product | null> {
        return new Promise(resolve => resolve({ ...this.findFunction(id) }));
    }

    insertProduct(title: string, description: string, price: number): Promise<string> {
        const newProduct = new Product(randomUUID(), title, description, price)
        InMemoryProductsService.products.push(newProduct)
        return new Promise(resolve => resolve(newProduct.id))
    }

    updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Promise<Product> {
        const prod = this.findFunction(id);
        if (prodTitle) {
            prod.title = prodTitle;
        }
        if (prodDescription) {
            prod.description = prodDescription;
        }
        if (prodPrice >= 0) {
            prod.price = prodPrice;
        }
        return new Promise<Product>(resolve => resolve({ ...prod }));
    }

    deleteProduct(id: string): Promise<void> {
        const prodIndex = InMemoryProductsService.products.findIndex(product => product.id === id);
        if (prodIndex > -1) {
            InMemoryProductsService.products.splice(prodIndex, 1);
        }
        return new Promise(resolve => resolve());
    }

    private findFunction(id: string) {
        const product = InMemoryProductsService.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException('Could not find product with id: ' + id);
        }
        return product;
    }
}