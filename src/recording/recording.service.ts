import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/* https://documenter.getpostman.com/view/6319646/SVSLr9AM#6e47859b-5ab5-47b0-8095-5a3ec3dba54c */
@Injectable({ scope: Scope.REQUEST })
export class RecordingService {
    appId: string;

    constructor(config: ConfigService) {
        this.appId = config.get<string>('agora.appId');
    }

    async acquire(): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/acquire`;
        const response = await axios.post(url);
        return response.data;
    }

    async start(resourceId: string, mode: string): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/mode/${mode}/start`;
        await axios.post(url, {  });
    }

    async stop(resourceId: string, sid: string, mode: string): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/stop`;
        await axios.post(url, {  });
    }

    async query(resourceId: string, sid: string, mode: string): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/query`;
        const response = await axios.get(url);
        return response.data;
    }
}
