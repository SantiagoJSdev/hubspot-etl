import { Module } from '@nestjs/common';
import { HubspotModule } from './hubspot/hubspot.module';
import { ConfigModule } from '@nestjs/config';
import { WarehouseModule } from './warehouse/warehouse.module';
import { DataSyncModule } from './data_sync/data_sync.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { configuration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HubspotModule,
    WarehouseModule,
    DataSyncModule,
    AnalyticsModule,
  ]
})
export class AppModule {}
