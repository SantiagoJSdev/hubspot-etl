import { Controller, Get, Logger, HttpStatus, Res } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * API 1: Obtiene el resumen de ingresos (Revenue) y el conteo de Tratos Ganados.
   * Path: GET /analytics/revenue-summary
   */
  @Get('revenue-summary')
  async getRevenueSummary(@Res() res) {
    this.logger.log('Solicitud recibida: GET /analytics/revenue-summary');
    try {
      const summary = await this.analyticsService.getDealsRevenueSummary();
      return res.status(HttpStatus.OK).json(summary);
    } catch (error) {
      this.logger.error('Error al obtener el resumen de ingresos', error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al consultar la base de datos de análisis.',
      });
    }
  }

  /**
   * API 2: Obtiene el número total de Leads (Contactos) creados.
   * Path: GET /analytics/leads-count
   */
  @Get('leads-count')
  async getLeadsCount(@Res() res) {
    this.logger.log('Solicitud recibida: GET /analytics/leads-count');
    try {
      const count = await this.analyticsService.getTotalLeadsCount();
      return res.status(HttpStatus.OK).json({ total_leads: count });
    } catch (error) {
      this.logger.error('Error al obtener el conteo de leads', error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al consultar la base de datos de análisis.',
      });
    }
  }
}