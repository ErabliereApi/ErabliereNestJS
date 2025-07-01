import { SaleOrderData } from "../saleorder.data.model";

export interface ISaleOrderService {
    getSaleOrders(): Promise<any[]>;
    getSaleOrder(id: string): Promise<any>;
    insertSaleOrder(postSaleOrder: SaleOrderData): Promise<string>;
}