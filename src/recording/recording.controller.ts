import { Controller, Get, Post, Query } from '@nestjs/common';
import { RecordingService } from './recording.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('recording')
@Controller('recording')
export class RecordingController {
    constructor(private readonly agoraService: RecordingService) {}

    @Post('acquire')
    async acquire(): Promise<void> {
        await this.agoraService.acquire();
    }

    @Post('start')
    async start(@Query('resourceId') resourceId: string, @Query('mode') mode: string): Promise<void> {
        await this.agoraService.start(resourceId, mode);
    }

    @Post('stop')
    async stop(@Query('resourceId') resourceId: string, @Query('sid') sid: string, @Query('mode') mode: string): Promise<void> {
        await this.agoraService.stop(resourceId, sid, mode);
    }

    @Get('query')
    async query(@Query('resourceId') resourceId: string, @Query('sid') sid: string, @Query('mode') mode: string): Promise<any> {
        return this.agoraService.query(resourceId, sid, mode);
    }
}