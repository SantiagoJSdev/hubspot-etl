import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
