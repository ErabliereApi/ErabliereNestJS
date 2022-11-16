import { Body, Controller, Delete, Get, Inject, Param, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DocumentIdModel } from "./document.id.model";
import { DocumentMetadataModel } from "./document.metadata.model";
import { PutDocumentModel } from "./put.document.model";
import { IDocumentService } from "./services/idocument.service";

@ApiBearerAuth()
@ApiTags('documents')
@Controller('documents')
export class DocumentController {
    
    constructor(
        @Inject(IDocumentService) private readonly documentService: IDocumentService) {
    }

    @Get()
    getDocuments(): DocumentMetadataModel[] {
        return this.documentService.getDocuments();
    }

    @Put()
    putDocument(@Body() document: PutDocumentModel): DocumentIdModel {
        return this.documentService.putDocument(document);
    }

    @Delete(':id')
    deleteDocument(@Param('id') id: string): void {
        this.documentService.deleteDocument(id);
    }
}