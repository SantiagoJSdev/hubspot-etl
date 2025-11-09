import { 
  Controller, 
  Post, 
  Logger, 
  HttpStatus, 
  HttpCode, 
  InternalServerErrorException 
} from '@nestjs/common';
import { DataSyncService } from './data_sync.service';
import { SyncResponseDto } from './dto/sync-response.dto'; 

@Controller('data-sync')
export class DataSyncController {
  private readonly logger = new Logger(DataSyncController.name);
  
  constructor(private readonly dataSyncService: DataSyncService) {}

  @Post('run')
  @HttpCode(HttpStatus.OK)
  async runSync(): Promise<SyncResponseDto> {
    this.logger.log('Solicitud recibida para iniciar la sincronización manual.');
    try {
      await this.dataSyncService.runFullSync(); 
      return {
        message: 'Sincronización ETL iniciada y completada con éxito. Revisa logs y DB.',
        status: 'SUCCESS',
      };
      
    } catch (error) {
      this.logger.error('Error durante la sincronización ETL.', error.stack);
      throw new InternalServerErrorException({
        message: 'Fallo al iniciar el proceso ETL. Revisa el token de HubSpot o la conexión a PostgreSQL.',
        status: 'ERROR',
        details: error.message,
      });
    }
  }
}