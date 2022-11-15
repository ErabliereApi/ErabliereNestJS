import { Injectable } from "@nestjs/common";
import { generateId } from "src/app/generator/idGenerator";
import { DocumentMetadataModel } from "../document.metadata.model";
import { PutDocumentModel } from "../put.document.model";
import { IDocumentService } from "./idocument.service";

@Injectable()
export class InMemoryDocumentService implements IDocumentService {

    documents = new Map<string, DocumentMetadataModel>();

    getDocuments(): DocumentMetadataModel[] {
        const docs = []
        this.documents.forEach((value, key) => {
            docs.push(value);
        });
        return docs;
    }

    putDocument(document: PutDocumentModel): string {
        if (!document.id) {
            document.id = generateId();
        }
        const id = document.id;
        const size = Buffer.from(document.content, 'base64').length
        this.documents.set(id, {
            id: id,
            name: document.name,
            description: document.description,
            size: size
        });
        return id;
    }

    deleteDocument(id: string): void {
        this.documents.delete(id);
    }
}