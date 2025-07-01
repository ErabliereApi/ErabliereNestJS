import { HttpService } from "@nestjs/axios";
import { Contact } from "../contact.model";
import { IContactService } from "./icontact.service";
import { ConfigService } from "@nestjs/config";
import { AppLogger } from "src/app/logger/app.logger";
import { AccessTokenService } from "src/businesscentral/access-token.service";
import { firstValueFrom } from "rxjs";

export class BusinessCentralContactService implements IContactService {
    constructor(private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: AppLogger,
        private readonly accessTokenService: AccessTokenService) {
    }
    getContacts(email?: string, $top?: number, $skip?: number): Promise<Contact[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await this.accessTokenService.getAccessToken();
                const url = this.config.get<string>("businessCentral.url") + "/" +
                    this.config.get<string>('businessCentral.tenantId') +
                    "/production/api/v2.0/contacts";

                const params: any = {};
                if (email) {
                    params.$filter = `email eq '${email}'`;
                }
                if ($top) {
                    params.$top = $top;
                }
                if ($skip) {
                    params.$skip = $skip;
                }

                const response = await firstValueFrom(this.httpService.get<any>(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    params
                }));

                if (response.status !== 200) {
                    this.logger.error(`Failed to fetch contacts: ${response.statusText}`);
                    return reject(new Error(`Failed to fetch contacts: ${response.statusText}`));
                }

                this.logger.log(`Fetched ${response.data.value.length} contacts from Business Central.`);
                resolve(response.data.value.map(contact => ({
                    email: contact.email,
                    customerNumber: '',
                    displayName: contact.displayName,
                } as Contact)));
            } catch (error) {
                this.logger.error('Error fetching contacts', error);
                reject(error);
            }
        });
    }
}