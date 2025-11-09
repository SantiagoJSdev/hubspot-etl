import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { 
  GET_REVENUE_SUMMARY_QUERY, 
  GET_LEADS_COUNT_QUERY 
} from './sql/analytics.sql';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const databaseUrl = this.configService.get<string>('database.url');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está definida.');
    }
    this.pool = new Pool({ connectionString: databaseUrl });
  }

  /**
   * Obtiene el total de ingresos y el conteo de tratos cerrados ganados.
   */
  async getDealsRevenueSummary(): Promise<any> {
      
    const res = await this.pool.query(GET_REVENUE_SUMMARY_QUERY);
    return {
        total_revenue: parseFloat(res.rows[0].total_revenue) || 0,
        won_deals_count: parseInt(res.rows[0].won_deals_count) || 0,
    };
  }
  
  /**
   * Obtiene el número total de leads (contactos) cargados.
   */
  async getTotalLeadsCount(): Promise<number> {
    const res = await this.pool.query(GET_LEADS_COUNT_QUERY);
    return parseInt(res.rows[0].total) || 0;
  }
}