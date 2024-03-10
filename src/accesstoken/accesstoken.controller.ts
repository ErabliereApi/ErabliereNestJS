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
    async getAccessToken(
        @Param('uid') uid: number, 
        @Query('channel') channel: string|undefined,
        @Query('role') role: string|undefined = 'publisher',
        @Query('tokenType') tokenType: string|undefined = 'rtc')
            : Promise<{ uid: number, channel: string, accessToken: string}> {
        
        if (tokenType === 'rtm') {
            const accessToken = await this.accessTokenService.getRtmAccessToken(uid);
            return {
                uid: uid,
                channel: '',
                accessToken: accessToken
            }
        }

        const accessToken = await this.accessTokenService.getRtcAccessToken(channel, uid);
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