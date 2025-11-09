import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    // Reutiliza la conexión de PostgreSQL. Asumimos el mismo pool que WarehouseService
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está definida.');
    }
    this.pool = new Pool({ connectionString: databaseUrl });
  }

  /**
   * Obtiene el total de ingresos y el conteo de tratos cerrados ganados.
   */
  async getDealsRevenueSummary(): Promise<any> {
    const query = `
      SELECT 
        SUM(monto) AS total_revenue,
        COUNT(hubspot_deal_id) AS won_deals_count
      FROM deals
      WHERE etapa = 'closedwon'; 
    `;
    
    const res = await this.pool.query(query);
    return {
        total_revenue: parseFloat(res.rows[0].total_revenue) || 0,
        won_deals_count: parseInt(res.rows[0].won_deals_count) || 0,
    };
  }
  
  /**
   * Obtiene el número total de leads (contactos) cargados.
   */
  async getTotalLeadsCount(): Promise<number> {
    const query = `SELECT COUNT(*) AS total FROM leads;`;
    const res = await this.pool.query(query);
    return parseInt(res.rows[0].total) || 0;
  }
}