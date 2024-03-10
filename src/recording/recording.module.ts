import { Module } from '@nestjs/common';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
    controllers: [RecordingController],
    providers: [RecordingService],
    imports: [HttpModule, ConfigModule]
})
export class RecordingModule {}