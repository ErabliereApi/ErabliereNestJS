import { HttpService } from "@nestjs/axios";
import { DocumentIdModel } from "../document.id.model";
import { DocumentMetadataModel } from "../document.metadata.model";
import { PutDocumentModel } from "../put.document.model";
import { IDocumentService } from "./idocument.service";
import { ConfigService } from "@nestjs/config";
import { AppLogger } from "src/app/logger/app.logger";

export class RelayDocumentService implements IDocumentService {
    constructor(private readonly httpService: HttpService, private readonly config: ConfigService, private readonly logger: AppLogger) {
    }

    getDocuments(): DocumentMetadataModel[] {
        throw new Error("Method not implemented.");
    }
    downloadDocument(id: string): Buffer {
        throw new Error("Method not implemented.");
    }
    putDocument(document: PutDocumentModel): DocumentIdModel {
        throw new Error("Method not implemented.");
    }
    deleteDocument(id: string): void {
        throw new Error("Method not implemented.");
    }
    
}