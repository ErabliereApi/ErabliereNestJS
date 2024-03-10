import { BadRequestException, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RtcRole, RtcTokenBuilder, RtmTokenBuilder } from "agora-token";

@Injectable({ scope: Scope.REQUEST })
export class AccessTokenService {
    constructor(private config: ConfigService) {
    }

    async getRtcAccessToken(channelName: string, uid: number): Promise<string> {
        var appID = this.config.get('agora.appId');
        var appCertificate = this.config.get('agora.appCertificate');

        // token expire time, hardcode to 3600 seconds = 1 hour
        var expirationTimeInSeconds = 3600
        var role = RtcRole.PUBLISHER

        var currentTimestamp = Math.floor(Date.now() / 1000)
        var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
        if (!channelName) {
            throw new BadRequestException({ 'error': 'channel name is required', 'channel': channelName });
        }

        var key = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, expirationTimeInSeconds, privilegeExpiredTs);

        return key;
    }

    async getRtmAccessToken(uid: number): Promise<string> {
        var appID = this.config.get('agora.appId');
        var appCertificate = this.config.get('agora.appCertificate');

        // token expire time, hardcode to 3600 seconds = 1 hour
        var expirationTimeInSeconds = 3600

        var currentTimestamp = Math.floor(Date.now() / 1000)
        var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

        var key = RtmTokenBuilder.buildToken(appID, appCertificate, uid, privilegeExpiredTs);

        return key;
    }

    getAppId(): string {
        return this.config.get('agora.appId');
    }
}