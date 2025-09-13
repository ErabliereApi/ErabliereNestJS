import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProductController } from "./product.controller";
import { ProductServiceFactory } from "./product.service.factory";
import { AppLoggerModule } from "../app/logger/logger.module";

@Module({
    controllers: [ProductController],
    providers: [
        ProductServiceFactory
    ],
    imports: [HttpModule, ConfigModule, AppLoggerModule]
})
export class ProductModule {

}