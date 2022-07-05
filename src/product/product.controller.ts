import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Product } from "./product.model";
import { ProductsService } from "./product.service";

@Controller('products')
export class ProductController {
    
    constructor(private readonly services: ProductsService) {

    }

    @Get()
    getProducts(): Product[] 
    {
        return this.services.getProducts();
    }

    @Get(':id')
    getProduct(@Param('id') id: string): Product 
    {
        return this.services.getProduct(id);
    }

    @Post()
    addProduct(@Body('title') prodTitle: string,
               @Body('description') prodDescription: string,
               @Body('price') prodPrice: number): any 
    {
        let id = this.services.insertProduct(prodTitle, prodDescription, prodPrice);
        return { id };
    }

    @Patch(':id')
    patchProduct(@Param('id') id: string, 
                @Body('title') prodTitle: string,
                @Body('description') prodDescription: string,
                @Body('price') prodPrice: number): Product 
    {
        return this.services.updateProduct(id, prodTitle, prodDescription, prodPrice);
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string): any 
    {
        this.services.deleteProduct(id);
        return { id };
    }
}