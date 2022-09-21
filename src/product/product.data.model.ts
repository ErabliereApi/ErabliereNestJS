import { ApiProperty } from "@nestjs/swagger/dist/decorators";

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
}