import { ApiProperty } from "@nestjs/swagger/dist/decorators";

export class ProductId {  
    constructor(
        id: string
    ) {
        this.id = id
    }

    @ApiProperty()
    id: string
}