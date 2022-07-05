import { Injectable, NotFoundException } from "@nestjs/common";
import { NotFoundError } from "rxjs";
import { Product } from "./product.model";

@Injectable()
export class ProductsService {
    
    products: Product[] = [];

    getProducts(): Product[] {
        return [ ...this.products ]
    }

    getProduct(id: string): Product | null {
        return { ...this.findFunction(id) };
    }

    insertProduct(title: string, description: string, price: number): string {
        const newProduct = new Product(new Date().toString(), title, description, price)
        this.products.push(newProduct)
        return newProduct.id
    }

    updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Product {
        const prod = this.findFunction(id);
        if (prodTitle) {
            prod.title = prodTitle;
        }
        if (prodDescription) {
            prod.description = prodDescription;
        }
        if (prodPrice) {
            prod.price = prodPrice;
        }
        return { ...prod };
    }

    deleteProduct(id: string) {
        const prodIndex = this.products.findIndex(product => product.id === id);
        if (prodIndex > -1) {
            this.products.splice(prodIndex, 1);
        }
    }

    private findFunction(id: string) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException('Could not find product with id: ' + id);
        }
        return product;
    }
}