import { ISaleOrderService } from "./isaleorder.service";

export class BusinessCentralSaleOrderService implements ISaleOrderService {

    async getSaleOrders(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

    async getSaleOrder(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async insertSaleOrder(postSaleOrder: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
}