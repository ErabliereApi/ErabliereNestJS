import { Product } from "../product.model"

export interface IProductService {
    getProducts(): Promise<Product[]>
    getProduct(id: string): Promise<Product | null>
    insertProduct(title: string, description: string, price: number): Promise<string>
    updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Promise<Product>
    deleteProduct(id: string): Promise<void>
}

export const IProductService = Symbol("IProductService");