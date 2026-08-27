import { ApiProperty } from "@nestjs/swagger"

export class ProductId {  
    constructor(
        id: string
    ) {
        this.id = id
    }

    @ApiProperty()
    id: string
}