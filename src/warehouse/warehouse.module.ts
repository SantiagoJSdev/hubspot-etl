import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Module({
  providers: [WarehouseService],
  exports: [WarehouseService], // Exportar el servicio
})
export class WarehouseModule {}