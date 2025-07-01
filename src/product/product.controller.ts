import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { ProductData } from "./product.data.model";
import { ProductId } from "./product.id.model";
import { Product } from "./product.model";
import { ProductServiceFactory } from "./product.service.factory";
import { IProductService } from "./services/iproduct.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Response } from "express";

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
    @ApiParam({ name: '$top', required: false, description: 'Number of products to return' })
    @ApiParam({ name: '$skip', required: false, description: 'Number of products to skip' })
    async getProducts(
        @Query('$top') $top?: number,
        @Query('$skip') $skip?: number
    ): Promise<Product[]> {
        return await this.services.getProducts();
    }

    @Get(':id')
    @ApiOkResponse({ type: Product })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async getProduct(@Param('id') id: string): Promise<Product> {
        return await this.services.getProduct(id);
    }

    @Get(':id/picture')
    @ApiOkResponse({ type: String, description: 'The picture' })
    @ApiOkResponse({ schema: { type: 'string', format: 'binary' }, description: 'The picture as a binary stream' })
    async getProductPicture(@Param('id') id: string, @Res() res: Response): Promise<void> {
        const stream = await this.services.getProductPicture(id);
        res.set('Content-Type', 'image/jpeg');
        stream.pipe(res);
    }

    @Post()
    @ApiOkResponse({ type: ProductId })
    async addProduct(@Body() product: ProductData): Promise<ProductId> {
        let id = await this.services.insertProduct(product.title, product.description, product.price, product.itemVariants);
        return new ProductId(id);
    }

    @Put(':id')
    @UseInterceptors(FilesInterceptor('images', 5, {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        })
    }))
    @ApiOkResponse({ type: ProductId })
    async addImages(
        @Param('id') id: string,
        @UploadedFiles() images?: Express.Multer.File[]
    ): Promise<ProductId> {
        const imagePaths = images?.map(img => `/uploads/products/${img.filename}`) || [];
        this.services.addImagesToProduct(id, imagePaths);
        return new ProductId(id);
    }

    @Patch(':id')
    @ApiOkResponse({ type: Product })
    async patchProduct(@Param('id') id: string,
        @Body() product: ProductData): Promise<Product> {
        return await this.services.updateProduct(id, product.title, product.description, product.price);
    }

    @Delete(':id')
    @ApiOkResponse({ type: ProductId })
    async deleteProduct(@Param('id') id: string): Promise<ProductId> {
        await this.services.deleteProduct(id);
        return new ProductId(id);
    }
}