import { 
  Controller, 
  Get, 
  Logger, 
  InternalServerErrorException
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { LeadsCountDto, RevenueSummaryDto } from './dto/analytics-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue-summary')
  @ApiOperation({
    summary: 'Obtener resumen de ingresos',
    description: 'Devuelve el total de ingresos y el conteo de tratos ganados desde el Data Warehouse.',
  })
  @ApiResponse({ status: 200, description: 'Resumen de ingresos obtenido con éxito.', type: RevenueSummaryDto })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getRevenueSummary(): Promise<RevenueSummaryDto> {
    this.logger.log('Solicitud recibida: GET /analytics/revenue-summary');
    try {
      // Si el servicio devuelve el tipo correcto, NestJS lo serializa.
      return await this.analyticsService.getDealsRevenueSummary();
    } catch (error) {
      this.logger.error('Error al obtener el resumen de ingresos', error.stack);
      throw new InternalServerErrorException({
        message: 'Error al consultar la base de datos de análisis.',
        details: error.message,
      });
    }
  }
 
  @Get('leads-count')
  @ApiOperation({
    summary: 'Obtener conteo total de leads',
    description: 'Devuelve el número total de leads (contactos) almacenados en el Data Warehouse.',
  })
  @ApiResponse({ status: 200, description: 'Conteo de leads obtenido con éxito.', type: LeadsCountDto })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getLeadsCount(): Promise<LeadsCountDto> {
    this.logger.log('Solicitud recibida: GET /analytics/leads-count');
    try {
      return await this.analyticsService.getTotalLeadsCount();
    } catch (error) {
      this.logger.error('Error al obtener el conteo de leads', error.stack);
      throw new InternalServerErrorException({
        message: 'Error al consultar la base de datos de análisis.',
        details: error.message,
      });
    }
  }
}