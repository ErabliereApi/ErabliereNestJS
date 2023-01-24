import { Injectable } from "@nestjs/common";
import { generateId } from "src/app/generator/idGenerator";
import { DocumentIdModel } from "../document.id.model";
import { DocumentMetadataModel } from "../document.metadata.model";
import { PutDocumentModel } from "../put.document.model";
import { IDocumentService } from "./idocument.service";
import { NotFoundException } from "@nestjs/common/exceptions";

@Injectable()
export class InMemoryDocumentService implements IDocumentService {
    private static documents = new Map<string, DocumentMetadataModel>();
    private static documentsData = new Map<string, string>();

    getDocuments(): DocumentMetadataModel[] {
        const docs = []
        InMemoryDocumentService.documents.forEach((value, key) => {
            docs.push(value);
        });
        return docs;
    }

    downloadDocument(id: string): Buffer {
        const document = InMemoryDocumentService.documentsData.get(id);
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
        InMemoryDocumentService.documents.set(id, {
            id: id,
            name: document.name,
            description: document.description,
            size: size
        });
        InMemoryDocumentService.documentsData.set(id, document.content);
        return new DocumentIdModel(id);
    }

    deleteDocument(id: string): void {
        InMemoryDocumentService.documents.delete(id);
        InMemoryDocumentService.documentsData.delete(id);
    }
}