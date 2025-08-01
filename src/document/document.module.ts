import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { HttpModule } from "@nestjs/axios";
import { DocumentServiceFactory } from "./document.service.factory";
import { ConfigModule } from "@nestjs/config";
import { AppLoggerModule } from "../app/logger/logger.module";

@Module({
    controllers: [DocumentController],
    providers: [
        DocumentServiceFactory
    ],
    imports: [HttpModule, ConfigModule, AppLoggerModule]
})
export class DocumentModule {
    
}