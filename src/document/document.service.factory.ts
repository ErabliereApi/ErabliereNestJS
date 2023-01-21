import { Injectable, Logger } from "@nestjs/common";
import { IDocumentService } from "./services/idocument.service";
import { ConfigService } from "@nestjs/config";
import { RelayDocumentService } from "./services/relay.document.service";
import { InMemoryDocumentService } from "./services/inmemory.document.service";
import { HttpService } from "@nestjs/axios";
import { AppLogger } from "src/app/logger/app.logger";

@Injectable()
export class DocumentServiceFactory {   

    private mode = ""

    private singletonService: IDocumentService | undefined;

    constructor(private readonly httpService: HttpService, private readonly config: ConfigService, private readonly logger: AppLogger) {
    }

    createDocumentService(): IDocumentService {
        if (this.singletonService !== undefined) {
            this.logger.verbose('Using singleton DocumentService');
            return this.singletonService;
        }

        if (this.mode === 'relay') {
            this.logger.verbose('Using RelayDocumentService');
            this.singletonService = new RelayDocumentService(this.httpService, this.config, this.logger);  
        } else {
            this.logger.verbose('Using InMemoryProductsService');
            this.singletonService = new InMemoryDocumentService();
        }

        return this.singletonService;
    }
}
