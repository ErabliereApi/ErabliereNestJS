import { Contact } from "../contact.model";

export interface IContactService {
    getContacts(email?: string, $top?: number, $skip?: number): Promise<Contact[]>;
}