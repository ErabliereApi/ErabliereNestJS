import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from 'src/app/logger/logger.module';

@Module({
    controllers: [StorageController],
    providers: [StorageService],
    imports: [ConfigModule, AppLoggerModule]
})
export class StorageModule {}