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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Data Sync (ETL)')
@Controller('data-sync') 
export class DataSyncController {
  private readonly logger = new Logger(DataSyncController.name);
  
  constructor(private readonly dataSyncService: DataSyncService) {}

  @Post('run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Iniciar Sincronización Manual ETL', 
    description: 'Dispara el proceso completo de Extracción, Transformación y Carga de datos desde HubSpot a PostgreSQL.' 
  })
  @ApiResponse({
    status: 200,
    description: 'El proceso ETL se completó exitosamente.',
    type: SyncResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor durante el proceso ETL.' })
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