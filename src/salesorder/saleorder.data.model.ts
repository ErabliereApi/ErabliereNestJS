import { ApiProperty } from "@nestjs/swagger";

export class SaleOrderData {

    @ApiProperty()
    orderDate: Date;

    @ApiProperty()
    customerNumber: string;

    @ApiProperty()
    products?: {
        productId: string;
        quantity: number;
    }[];
}