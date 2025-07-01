import { Controller, Get, Post, Query } from "@nestjs/common";
import { StorageService } from './storage.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('storage')
@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Get('container')
    async container(@Query('container') container: string): Promise<any> {
        return await this.storageService.getContainer(container);
    }

    @Post('upload')
    async upload(
        @Query('file') file: string,
        @Query('container') container: string,
        @Query('name') name: string
    ): Promise<any> {
        return await this.storageService.upload(file, container, name);
    }
}