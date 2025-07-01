export class SaleOrderData {
    orderDate: Date;
    customerNumber: string;
    products: {
        productId: string;
        quantity: number;
    }[];
}