import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenService } from './accesstoken.service';

@ApiBearerAuth()
@ApiTags('accesstoken')
@Controller('accesstoken')
export class AccessTokenController {
    constructor(private readonly accessTokenService: AccessTokenService) {}

    /* https://github.com/AgoraIO/Tools/blob/master/DynamicKey/AgoraDynamicKey/nodejs/server/DemoServer.js */
    @Get(':uid')
    async getAccessToken(@Param('uid') uid: number, @Query('channel') channel: string): Promise<{ uid: number, channel: string, accessToken: string}> {
        const accessToken = await this.accessTokenService.getAccessToken(channel, uid);
        return {
            uid: uid,
            channel: channel,
            accessToken: accessToken
        }
    }

    @Get('appId/view')
    async getAppId(): Promise<{ appId: string }> {
        const appId = this.accessTokenService.getAppId();
        return {
            appId: appId
        }
    }
}