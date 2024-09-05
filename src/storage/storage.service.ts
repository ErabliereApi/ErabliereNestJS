import { Injectable, InternalServerErrorException, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { AppLogger } from 'src/app/logger/app.logger';

@Injectable({ scope: Scope.REQUEST })
export class StorageService {
    azureStorageName;
    azureStorageAccessKey;
    azureStorageContainerName;

    constructor(
        config: ConfigService, 
        private readonly logger: AppLogger) {
        this.azureStorageName = config.get<string>('AzureStorageAccount.storageName');
        this.azureStorageAccessKey = config.get<string>('AzureStorageAccount.accessKey');
        this.azureStorageContainerName = config.get<string>('AzureStorageAccount.containerName');
    }

    getContainer(container: string): any {
        // Log the azure storage account name and access key
        this.logger.log(`Azure Storage Access Key: ${this.azureStorageAccessKey}`);
        this.logger.log(`Azure Storage Container Name: ${this.azureStorageContainerName}`);
        this.logger.log(`Azure Storage Account Name: ${this.azureStorageName}`);

        var blobServiceClient = new BlobServiceClient(
            `https://${this.azureStorageName}.blob.core.windows.net`,
            new StorageSharedKeyCredential(this.azureStorageName, this.azureStorageAccessKey)
        );

        var containerClient = blobServiceClient.getContainerClient(container);

        return containerClient;
    }

    async upload(file: string, container: string, name: string): Promise<any> {
        // Log the azure storage account name and access key
        this.logger.log(`Azure Storage Account Name: ${this.azureStorageName}`);
        this.logger.log(`Azure Storage Access Key: ${this.azureStorageAccessKey}`);
        this.logger.log(`Azure Storage Container Name: ${this.azureStorageContainerName}`);

        try {
            var blobServiceClient = new BlobServiceClient(
                `https://${this.azureStorageName}.blob.core.windows.net`,
                new StorageSharedKeyCredential(this.azureStorageName, this.azureStorageAccessKey)
            );
    
            var containerClient = blobServiceClient.getContainerClient(container);
    
            var blobClient = containerClient.getBlobClient(name);
    
            var blockBlobClient = blobClient.getBlockBlobClient();
    
            const resp = await blockBlobClient.upload(file, file.length);
    
            return resp;
        }
        catch (error) {
            this.logger.error('Error uploading file', error);
            throw new InternalServerErrorException(error);
        }
    }
}