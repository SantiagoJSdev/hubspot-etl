import { 
  Controller, 
  Get, 
  Logger, 
  InternalServerErrorException
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { LeadsCountDto, RevenueSummaryDto } from './dto/analytics-response.dto';

@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  // API 2: Obtiene un resumen del total.
  @Get('revenue-summary')
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
 
   // API 2: Obtiene el número total de Leads (Contactos) creados.
  @Get('leads-count')
  async getLeadsCount(): Promise<LeadsCountDto> {
    this.logger.log('Solicitud recibida: GET /analytics/leads-count');
    try {
      const count = await this.analyticsService.getTotalLeadsCount();
      return { total_leads: count };
    } catch (error) {
      this.logger.error('Error al obtener el conteo de leads', error.stack);
      throw new InternalServerErrorException({
        message: 'Error al consultar la base de datos de análisis.',
        details: error.message,
      });
    }
  }
}