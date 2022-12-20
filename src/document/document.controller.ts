import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { DocumentIdModel } from "./document.id.model";
import { DocumentMetadataModel } from "./document.metadata.model";
import { PutDocumentModel } from "./put.document.model";
import { IDocumentService } from "./services/idocument.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

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

    @Get(':id')
    downloadDocument(@Param('id') id: string, @Res() response: Response) {
        const docInfo = this.documentService.getDocuments().find(doc => doc.id === id);
        const docBuffer = this.documentService.downloadDocument(id);
        response.setHeader('Content-Type', 'application/octet-stream');
        response.setHeader('Content-Disposition', 'attachment; filename=' + docInfo.name);
        response.send(docBuffer);
    }

    @Put()
    putDocument(@Body() document: PutDocumentModel): DocumentIdModel {
        return this.documentService.putDocument(document);
    }

    @Delete(':id')
    deleteDocument(@Param('id') id: string): void {
        this.documentService.deleteDocument(id);
    }

    // V2
    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    postDocument(@UploadedFile() file: Express.Multer.File): DocumentIdModel {
        return this.documentService.putDocument({
            name: file.originalname,
            content: file.buffer.toString('base64'),
            description: ''
        });
    }
}