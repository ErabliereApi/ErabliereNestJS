import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { Contact } from "./contact.model";
import { ContactServiceFactory } from "./contact.service.factory";
import { IContactService } from "./services/icontact.service";

@ApiBearerAuth()
@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {

    private readonly services: IContactService

    constructor(private readonly serviceFactory: ContactServiceFactory) {
        this.services = this.serviceFactory.createContactService();
    }

    @Get()
    @ApiOkResponse({ type: [Contact] })
    @ApiParam({ name: '$top', required: false, description: 'Number of saleorders to return' })
    @ApiParam({ name: '$skip', required: false, description: 'Number of saleorders to skip' })
    async getSaleOrders(
        @Query('email') email?: string,
        @Query('$top') $top?: number,
        @Query('$skip') $skip?: number
    ): Promise<Contact[]> {
        return await this.services.getContacts(email, $top, $skip);
    }
}