import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ProductData } from "./product.data.model";
import { ProductId } from "./product.id.model";
import { Product } from "./product.model";
import { ProductServiceFactory } from "./product.service.factory";
import { IProductService } from "./services/iproduct.service";

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductController {
    
    private readonly services: IProductService

    constructor(private readonly serviceFactory: ProductServiceFactory) {
        this.services = this.serviceFactory.createProductService();
    }

    @Get()
    @ApiOkResponse({ type: [Product] })
    async getProducts(): Promise<Product[]> 
    {
        return await this.services.getProducts();
    }

    @Get(':id')
    @ApiOkResponse({ type: Product })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async getProduct(@Param('id') id: string): Promise<Product> 
    {
        return await this.services.getProduct(id);
    }

    @Post()
    @ApiOkResponse({ type: ProductId })
    async addProduct(@Body() product: ProductData): Promise<ProductId> 
    {
        let id = await this.services.insertProduct(product.title, product.description, product.price, product.itemVariants);
        return new ProductId(id);
    }

    @Patch(':id')
    @ApiOkResponse({ type: Product })
    async patchProduct(@Param('id') id: string, 
                 @Body() product: ProductData): Promise<Product> 
    {
        return await this.services.updateProduct(id, product.title, product.description, product.price);
    }

    @Delete(':id')
    @ApiOkResponse({ type: ProductId })
    async deleteProduct(@Param('id') id: string): Promise<ProductId> 
    {
        await this.services.deleteProduct(id);
        return new ProductId(id);
    }
}