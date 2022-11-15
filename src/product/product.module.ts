import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { InMemoryProductsService } from "./services/inmemory.product.service";
import { IProductService } from "./services/iproduct.service";

@Module({
    controllers: [ProductController],
    providers: [{
        provide: IProductService,
        useClass: InMemoryProductsService
    }],
    exports: [IProductService]
})
export class ProductModule {

}