import { Product } from "../product.model"

export interface IProductService {
    getProducts(): Product[]
    getProduct(id: string): Product | null
    insertProduct(title: string, description: string, price: number): string
    updateProduct(id: string, prodTitle: string, prodDescription: string, prodPrice: number): Product
    deleteProduct(id: string): void
}

export const IProductService = Symbol("IProductService");