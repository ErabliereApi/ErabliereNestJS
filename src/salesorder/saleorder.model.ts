import { Product } from "src/product/product.model";

export class SaleOrder {
    id: string;
    number: string;
    orderDate: Date;
    customerNumber: string;
    customerName: string;
    products: Product[];
}