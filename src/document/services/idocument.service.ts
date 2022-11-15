import { DocumentMetadataModel } from "../document.metadata.model";
import { PutDocumentModel } from "../put.document.model";

export interface IDocumentService {
    getDocuments(): DocumentMetadataModel[]
    putDocument(document: PutDocumentModel): string
    deleteDocument(id: string): void
}

export const IDocumentService = Symbol("IDocumentService");