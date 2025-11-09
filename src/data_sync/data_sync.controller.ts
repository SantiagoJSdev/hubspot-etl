import { Controller, Post, Res, HttpStatus, Logger } from '@nestjs/common';
import { DataSyncService } from './data_sync.service';

@Controller('data-sync')
export class DataSyncController {
  private readonly logger = new Logger(DataSyncController.name);
  
  constructor(private readonly dataSyncService: DataSyncService) {}

  /**
   * Endpoint POST para disparar el proceso ETL completo manualmente.
   * La respuesta indicará si la conexión con HubSpot fue exitosa.
   */
  @Post('run')
  async runSync(@Res() res): Promise<any> {
    this.logger.log('Solicitud recibida para iniciar la sincronización manual.');
    
    try {
      // 1. Llamamos al servicio principal de orquestación
      await this.dataSyncService.runFullSync(); 

      // 2. Si llega aquí, significa que al menos el Extract (E) funcionó.
      return res.status(HttpStatus.OK).json({
        message: 'Sincronización ETL iniciada y completada con éxito. Revisa logs y DB.',
        status: 'SUCCESS',
      });
      
    } catch (error) {
      this.logger.error('Error durante la sincronización ETL.', error.stack);
      
      // 3. Devolvemos un error 500 si falla (ej. Hubspot token inválido o DB down)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Fallo al iniciar el proceso ETL. Revisa el token de HubSpot o la conexión a PostgreSQL.',
        status: 'ERROR',
        details: error.message,
      });
    }
  }
}