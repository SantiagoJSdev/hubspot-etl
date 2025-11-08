import { Module } from '@nestjs/common';
import { DataSyncService } from './data_sync.service';
import { DataSyncController } from './data_sync.controller';

@Module({
  providers: [DataSyncService],
  controllers: [DataSyncController]
})
export class DataSyncModule {}
