import { HttpModule } from "@nestjs/axios";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProductController } from "./product.controller";
import { ProductServiceFactory } from "./product.service.factory";

@Module({
    controllers: [ProductController],
    providers: [
        ProductServiceFactory,
        Logger,
    ],
    imports: [HttpModule, ConfigModule]
})
export class ProductModule {

}