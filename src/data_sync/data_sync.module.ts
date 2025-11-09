import { Module } from '@nestjs/common';
import { DataSyncService } from './data_sync.service';
import { DataSyncController } from './data_sync.controller';
import { HubspotModule } from 'src/hubspot/hubspot.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';

@Module({
  imports: [HubspotModule, WarehouseModule],
  providers: [DataSyncService],
  controllers: [DataSyncController]
})
export class DataSyncModule {}
