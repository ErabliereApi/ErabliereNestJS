import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { InMemoryDocumentService } from "./services/inmemory.document.service";
import { IDocumentService } from "./services/idocument.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    controllers: [DocumentController],
    providers: [{
        provide: IDocumentService,
        useClass: InMemoryDocumentService
    }],
    exports: [IDocumentService],
    imports: [HttpModule]
})
export class DocumentModule {
    
}