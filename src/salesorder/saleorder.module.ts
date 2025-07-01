import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SaleOrderController } from "./saleorder.controller";
import { SaleOrderServiceFactory } from "./saleorder.service.factory";
import { AppLoggerModule } from "src/app/logger/logger.module";

@Module({
    controllers: [SaleOrderController],
    providers: [
        SaleOrderServiceFactory
    ],
    imports: [HttpModule, ConfigModule, AppLoggerModule]
})
export class SaleOrderModule {

}