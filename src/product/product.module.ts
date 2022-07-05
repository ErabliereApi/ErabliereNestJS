import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductsService } from "./product.service";

@Module({
    controllers: [ProductController],
    providers: [ProductsService],
})
export class ProductModule {

}