import { HttpService } from '@nestjs/axios';
import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export class AccessTokenService {
    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
        private readonly logger: LoggerService
    ) {}

    private static readonly cache: any = {};

    async getAccessToken(): Promise<string> {
        // Check if the access token is already cached and not expired
        if (AccessTokenService.cache.accessToken && AccessTokenService.cache.expiresAt && Date.now() < AccessTokenService.cache.expiresAt) {
            this.logger.log('Using cached access token.');
            return AccessTokenService.cache.accessToken;
        }

        const url = `https://login.microsoftonline.com/${this.config.get('businessCentral.tenantId')}/oauth2/v2.0/token`;
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', this.config.get<string>('businessCentral.clientId'));
        params.append('client_secret', this.config.get<string>('businessCentral.clientSecret'));
        params.append('scope', this.config.get<string>('businessCentral.scope'));

        const response = await axios.post(url, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (response.status !== 200) {
            this.logger.error(`Failed to fetch access token: ${response.statusText}`);
            throw new Error(`Failed to fetch access token: ${response.statusText}`);
        }

        const accessToken = response.data.access_token;
        if (!accessToken) {
            this.logger.error("Access token is not available.");
            throw new Error("Access token is not available.");
        }
        AccessTokenService.cache.accessToken = accessToken;
        AccessTokenService.cache.expiresAt = Date.now() + (response.data.expires_in * 1000); // Store expiration time
        this.logger.log('Access token fetched successfully.');
        return accessToken;
    }
}