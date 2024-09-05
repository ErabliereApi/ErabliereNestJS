import { Controller, Get, InternalServerErrorException, Param, Post, Query } from "@nestjs/common";
import { RecordingService } from './recording.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('recording')
@Controller('recording')
export class RecordingController {
    constructor(private readonly agoraService: RecordingService) {}

    @Post('acquire/:channelName')
    async acquire(
        @Param('channelName') channelName: string,
        @Query('uid') uid: number
    ): Promise<any> {
        return await this.agoraService.acquire(channelName, uid);
    }

    @Post('start/:channelName')
    async start(
        @Param('channelName') channelName: string,
        @Query('resourceId') resourceId: string,
        @Query('uid') uid: number,
        @Query('mode') mode: string = 'mix'
    ): Promise<void> {
        resourceId = this.sanatize(resourceId);
        mode = this.sanatize(mode);
        channelName = this.sanatize(channelName);
        return await this.agoraService.start(resourceId, mode, channelName, uid);
    }

    @Post('stop/:channelName')
    async stop(
        @Param('channelName') channelName: string,
        @Query('resourceId') resourceId: string,
        @Query('sid') sid: string,
        @Query('uid') uid: number,
        @Query('mode') mode: string = 'mix'
    ): Promise<void> {
        resourceId = this.sanatize(resourceId);
        sid = this.sanatize(sid);
        mode = this.sanatize(mode);
        channelName = this.sanatize(channelName);
        await this.agoraService.stop(resourceId, sid, mode, channelName, uid);
    }

    @Get('query/:resourceId')
    async query(
        @Param('resourceId') resourceId: string,
        @Query('sid') sid: string,
        @Query('mode') mode: string = "mix"
    ): Promise<any> {
        resourceId = this.sanatize(resourceId);
        sid = this.sanatize(sid);
        mode = this.sanatize(mode);
        return this.agoraService.query(resourceId, sid, mode);
    }

    private sanatize(value: string): string {
        return value.replace(/[^a-zA-Z0-9_-]/g, '');
    }
}