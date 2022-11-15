import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ProductData } from "./product.data.model";
import { ProductId } from "./product.id.model";
import { Product } from "./product.model";
import { IProductService } from "./services/iproduct.service";

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductController {
    
    constructor(@Inject(IProductService) private readonly services: IProductService) {

    }

    @Get()
    @ApiOkResponse({ type: [Product] })
    getProducts(): Product[] 
    {
        return this.services.getProducts();
    }

    @Get(':id')
    @ApiOkResponse({ type: Product })
    @ApiNotFoundResponse({ description: 'Product not found' })
    getProduct(@Param('id') id: string): Product 
    {
        return this.services.getProduct(id);
    }

    @Post()
    @ApiOkResponse({ type: ProductId })
    addProduct(@Body() product: ProductData): any 
    {
        let id = this.services.insertProduct(product.title, product.description, product.price);
        return new ProductId(id);
    }

    @Patch(':id')
    @ApiOkResponse({ type: Product })
    patchProduct(@Param('id') id: string, 
                 @Body() product: ProductData): Product 
    {
        return this.services.updateProduct(id, product.title, product.description, product.price);
    }

    @Delete(':id')
    @ApiOkResponse({ type: ProductId })
    deleteProduct(@Param('id') id: string): any 
    {
        this.services.deleteProduct(id);
        return new ProductId(id);
    }
}