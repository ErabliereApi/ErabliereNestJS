import { HttpService } from "@nestjs/axios";
import { ISaleOrderService } from "./isaleorder.service";
import { ConfigService } from "@nestjs/config";
import { AppLogger } from "src/app/logger/app.logger";
import { AccessTokenService } from "src/businesscentral/access-token.service";
import { firstValueFrom } from "rxjs";
import { SaleOrder } from "../saleorder.model";
import { SaleOrderData } from "../saleorder.data.model";

export class BusinessCentralSaleOrderService implements ISaleOrderService {
    constructor(private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger,
        private readonly accessTokenService: AccessTokenService) {
    }
    async getSaleOrders(): Promise<any[]> {
        const token = await this.accessTokenService.getAccessToken();

        const url = this.config.get<string>("businessCentral.url") + "/" +
            this.config.get<string>('businessCentral.tenantId') +
            "/production/api/v2.0/salesOrders";
        const response = await firstValueFrom(this.httpService.get<any>(url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        ));
        if (response.status !== 200) {
            this.logger.error(`Failed to fetch salesOrders: ${response.statusText}`);
            throw new Error(`Failed to fetch salesOrders: ${response.statusText}`);
        }
        this.logger.log(`Fetched ${response.data.length} salesOrders from Business Central.`);
        return response.data.value.map(prod => {
            return {
                customerName: prod.customerName,
                customerNumber: prod.customerNumber,
                id: prod.id,
                number: prod.number,
                orderDate: new Date(prod.orderDate),
                products: prod.items?.map(p => ({
                    id: p.id,
                    number: p.number,
                    description: p.description,
                    quantity: p.quantity,
                    unitPrice: p.unitPrice,
                    totalPrice: p.totalPrice
                }))
            } as SaleOrder;
        });
    }

    async getSaleOrder(id: string): Promise<any> {
        const token = await this.accessTokenService.getAccessToken();

        const url = this.config.get<string>("businessCentral.url") + "/" +
            this.config.get<string>('businessCentral.tenantId') +
            "/production/api/v2.0/salesOrders(" + id + ")";
        const response = await firstValueFrom(this.httpService.get<any>(url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        ));
        if (response.status !== 200) {
            this.logger.error(`Failed to fetch salesOrders: ${response.statusText}`);
            throw new Error(`Failed to fetch salesOrders: ${response.statusText}`);
        }
        this.logger.log(`Fetched ${response.data.length} salesOrders from Business Central.`);
        const prod = response.data;
        return {
            id: prod.id,
            number: prod.number,
            customerName: prod.customerName,
            customerNumber: prod.customerNumber,
            orderDate: new Date(prod.orderDate),
            products: prod.items?.map(p => ({
                id: p.id,
                number: p.number,
                description: p.description,
                quantity: p.quantity,
                unitPrice: p.unitPrice,
                totalPrice: p.totalPrice
            }))
        } as SaleOrder;
    }

    async insertSaleOrder(postSaleOrder: SaleOrderData): Promise<string> {
        const token = await this.accessTokenService.getAccessToken();

        const url = this.config.get<string>("businessCentral.url") + "/" +
            this.config.get<string>('businessCentral.tenantId') +
            "/production/api/v2.0/salesOrders";
        const response = await firstValueFrom(
            this.httpService.post<any>(url, {
                orderDate: postSaleOrder.orderDate,
                customerNumber: postSaleOrder.customerNumber,
                items: postSaleOrder.products.map(p => ({
                    id: p.productId,
                    quantity: p.quantity
                }))
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )
        );
        if (response.status !== 201) {
            this.logger.error(`Failed to create salesOrder: ${response.statusText}`);
            throw new Error(`Failed to create salesOrder: ${response.statusText}`);
        }
        this.logger.log(`Created salesOrder with id ${response.data.id} in Business Central.`);
        return response.data.id;
    }
}