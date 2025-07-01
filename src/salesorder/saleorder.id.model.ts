import { ApiProperty } from "@nestjs/swagger"

export class SaleOrderId {
    constructor(
        id: string
    ) {
        this.id = id
    }

    @ApiProperty()
    id: string
}