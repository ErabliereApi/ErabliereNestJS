import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { ItemVariant, Product } from "./product.model";
import { generateId } from "src/app/generator/idGenerator";

export class ProductData {  
    constructor(
        title: string,
        description: string,
        price: number
    ) {
        this.title = title
        this.description = description
        this.price = price
    }

    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    price: number

    @ApiProperty({ isArray: true, type: () => ItemVariantData })
    itemVariants: ItemVariantData[]
}

export class ItemVariantData {
    constructor(
        size: string,
        color: string
    ) {
        this.size = size
        this.color = color
    }

    @ApiProperty()
    size?: string

    @ApiProperty()
    color?: string
}