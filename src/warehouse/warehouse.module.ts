import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Module({
  providers: [WarehouseService]
})
export class WarehouseModule {}
