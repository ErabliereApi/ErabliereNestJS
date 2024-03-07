import { Module } from '@nestjs/common';
import { AccessTokenController } from './accesstoken.controller';
import { AccessTokenService } from './accesstoken.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [AccessTokenController],
    providers: [AccessTokenService],
    imports: [ConfigModule]
})
export class AccessTokenModule {}