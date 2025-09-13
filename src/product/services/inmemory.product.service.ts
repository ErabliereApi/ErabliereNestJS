import { Injectable, NotFoundException } from "@nestjs/common";
import { generateId } from "../../app/generator/idGenerator";
import { Product } from "../product.model";
import { IProductService } from "./iproduct.service";
import { ItemVariantData } from "../product.data.model";

@Injectable()
export class InMemoryProductsService implements IProductService {
       
    private static readonly products: Product[] = [];

    async getProducts(): Promise<Product[]> {
        const ps = await Promise.resolve([ ...InMemoryProductsService.products ]);

        const withoutCircularRefs = ps.map(p => ({ ...p }));

        for (const product of withoutCircularRefs) {
            product.itemVariants = product.itemVariants?.map(iv => ({ ...iv }));

            if (product.itemVariants) {
                for (const itemVariant of product.itemVariants) {
                    itemVariant.product = null;
                }
            }
        }

        return withoutCircularRefs;
    }

    getProduct(id: string): Promise<Product | null> {
        return Promise.resolve({ ...this.findFunction(id) });
    }

    insertProduct(title: string, description: string, price: number, itemVariants: ItemVariantData[]): Promise<string> {
        const newProduct = new Product(generateId(), title, description, price, itemVariants)
        InMemoryProductsService.products.push(newProduct)
        return Promise.resolve(newProduct.id);
    }

    addImagesToProduct(id: string, imagePaths: string[]): Promise<any> {
        const prod = this.findFunction(id);
        if (!prod.images) {
            prod.images = [];
        }
        prod.images.push(...imagePaths);
        return Promise.resolve({ id: prod.id, images: prod.images });
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
        return Promise.resolve({ ...prod });
    }

    deleteProduct(id: string): Promise<void> {
        const prodIndex = InMemoryProductsService.products.findIndex(product => product.id === id);
        if (prodIndex > -1) {
            InMemoryProductsService.products.splice(prodIndex, 1);
        }
        return Promise.resolve();
    }

    private findFunction(id: string) {
        const product = InMemoryProductsService.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException('Could not find product with id: ' + id);
        }
        return product;
    }
}