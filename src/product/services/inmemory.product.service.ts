import { Injectable, NotFoundException } from "@nestjs/common";
import { generateId } from "src/app/generator/idGenerator";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";

@Injectable()
export class InMemoryProductsService implements IProductService {
    
    products: Product[] = [];

    getProducts(): Promise<Product[]> {
        return new Promise(resolve => resolve([ ...this.products ]))
    }

    getProduct(id: string): Promise<Product | null> {
        return new Promise(resolve => resolve({ ...this.findFunction(id) }));
    }

    insertProduct(title: string, description: string, price: number): Promise<string> {
        const newProduct = new Product(generateId(), title, description, price)
        this.products.push(newProduct)
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
        const prodIndex = this.products.findIndex(product => product.id === id);
        if (prodIndex > -1) {
            this.products.splice(prodIndex, 1);
        }
        return new Promise(resolve => resolve());
    }

    private findFunction(id: string) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException('Could not find product with id: ' + id);
        }
        return product;
    }
}