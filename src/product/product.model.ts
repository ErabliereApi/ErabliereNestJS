import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { ItemVariantData } from "./product.data.model";
import { generateId } from "src/app/generator/idGenerator";

export class Product {  
    constructor(
        id: string,
        title: string,
        description: string,
        price: number,
        itemVariants: ItemVariantData[]
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.price = price
        this.itemVariants = itemVariants.map(itemVariant => 
            new ItemVariant(generateId(), itemVariant.size, itemVariant.color, this));
    }

    @ApiProperty()
    id: string

    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    price: number

    @ApiProperty({ isArray: true, type: () => ItemVariant })
    itemVariants: ItemVariant[]
}

export class ItemVariant {
    constructor(
        id: string,
        size: string,
        color: string,
        product: Product
    ) {
        this.id = id
        this.size = size
        this.color = color
        this.product = product
    }

    @ApiProperty()
    id: string

    @ApiProperty()
    size?: string

    @ApiProperty()
    color?: string

    @ApiProperty({ type: () => Product })
    product: Product
}