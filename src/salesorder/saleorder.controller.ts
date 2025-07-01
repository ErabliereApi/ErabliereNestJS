import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { SaleOrderData } from "./saleorder.data.model";
import { SaleOrderId } from "./saleorder.id.model"
import { SaleOrder } from "./saleorder.model";
import { SaleOrderServiceFactory } from "./saleorder.service.factory"
import { ISaleOrderService } from "./services/isaleorder.service";

@ApiBearerAuth()
@ApiTags('saleorders')
@Controller('saleorders')
export class SaleOrderController {

    private readonly services: ISaleOrderService

    constructor(private readonly serviceFactory: SaleOrderServiceFactory) {
        this.services = this.serviceFactory.createSaleOrderService();
    }

    @Get()
    @ApiOkResponse({ type: [SaleOrder] })
    @ApiParam({ name: '$top', required: false, description: 'Number of saleorders to return' })
    @ApiParam({ name: '$skip', required: false, description: 'Number of saleorders to skip' })
    async getSaleOrders(
        @Query('$top') $top?: number,
        @Query('$skip') $skip?: number
    ): Promise<SaleOrder[]> {
        return await this.services.getSaleOrders();
    }

    @Get(':id')
    @ApiOkResponse({ type: SaleOrder })
    @ApiNotFoundResponse({ description: 'SaleOrder not found' })
    async getSaleOrder(@Param('id') id: string): Promise<SaleOrder> {
        return await this.services.getSaleOrder(id);
    }

    @Post()
    @ApiOkResponse({ type: SaleOrderId })
    async addSaleOrder(@Body() saleorder: SaleOrderData): Promise<SaleOrderId> {
        const id = await this.services.insertSaleOrder(saleorder);
        return new SaleOrderId(id);
    }
}