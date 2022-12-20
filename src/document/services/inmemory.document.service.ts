import { Injectable } from "@nestjs/common";
import { generateId } from "src/app/generator/idGenerator";
import { DocumentIdModel } from "../document.id.model";
import { DocumentMetadataModel } from "../document.metadata.model";
import { PutDocumentModel } from "../put.document.model";
import { IDocumentService } from "./idocument.service";
import { NotFoundException } from "@nestjs/common/exceptions";

@Injectable()
export class InMemoryDocumentService implements IDocumentService {
    documents = new Map<string, DocumentMetadataModel>();
    documentsData = new Map<string, string>();

    getDocuments(): DocumentMetadataModel[] {
        const docs = []
        this.documents.forEach((value, key) => {
            docs.push(value);
        });
        return docs;
    }

    downloadDocument(id: string): Buffer {
        const document = this.documentsData.get(id);
        if (!document) {
            throw new NotFoundException('Document not found');
        }
        return Buffer.from(document, 'base64');
    }

    putDocument(document: PutDocumentModel): DocumentIdModel {
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
        this.documentsData.set(id, document.content);
        return new DocumentIdModel(id);
    }

    deleteDocument(id: string): void {
        this.documents.delete(id);
        this.documentsData.delete(id);
    }
}