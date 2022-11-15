import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { InMemoryDocumentService } from "./services/document.service";
import { IDocumentService } from "./services/idocument.service";

@Module({
    controllers: [DocumentController],
    providers: [{
        provide: IDocumentService,
        useClass: InMemoryDocumentService
    }],
    exports: [IDocumentService]
})
export class DocumentModule {
    
}