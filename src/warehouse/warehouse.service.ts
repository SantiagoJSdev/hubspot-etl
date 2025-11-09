import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { TransformedDealDto, TransformedLeadDto } from './dto/transformed.dto';

import { BULK_UPSERT_DEALS_QUERY } from './sql/deals.sql';
import { BULK_UPSERT_LEADS_QUERY } from './sql/leads.sql';

@Injectable()
export class WarehouseService implements OnModuleInit {
  private readonly logger = new Logger(WarehouseService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  // Usamos OnModuleInit para asegurar que el pool se cree
  onModuleInit() {
    const databaseUrl = this.configService.get<string>('database.url');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está definida en .env');
    }
    this.pool = new Pool({
      connectionString: databaseUrl,
    });
    this.logger.log('Pool de PostgreSQL inicializado.');
  }

  /**
   * Carga masiva de Deals (Tratos) usando UPSERT.
   */
  async bulkUpsertDeals(deals: TransformedDealDto[]): Promise<void> {
    if (deals.length === 0) {
      this.logger.log('No hay deals para cargar.');
      return;
    }
    const client = await this.pool.connect();
    try {
      const ids = deals.map((d) => d.hubspot_deal_id);
      const nombres = deals.map((d) => d.nombre_trato);
      const montos = deals.map((d) => d.monto);
      const etapas = deals.map((d) => d.etapa);
      const creacion = deals.map((d) => d.fecha_creacion_hubspot);
      const cierre = deals.map((d) => d.fecha_cierre_hubspot);
      await client.query(BULK_UPSERT_DEALS_QUERY, [ids, nombres, montos, etapas, creacion, cierre]);
      this.logger.log(`Upsert masivo de ${deals.length} deals completado.`);
    } catch (error) {
      this.logger.error('Error en el upsert masivo de deals', error.stack);
    } finally {
      client.release();
    }
  }

  /**
   * Carga masiva de Leads (Contactos) usando UPSERT.
   */
  async bulkUpsertLeads(leads: TransformedLeadDto[]): Promise<void> {
    if (leads.length === 0) {
      this.logger.log('No hay leads para cargar.');
      return;
    }
    const client = await this.pool.connect();
    try {
      const ids = leads.map((l) => l.hubspot_contact_id);
      const emails = leads.map((l) => l.email);
      const nombres = leads.map((l) => l.nombre);
      const apellidos = leads.map((l) => l.apellido);
      const creacion = leads.map((l) => l.fecha_creacion_hubspot);
      await client.query(BULK_UPSERT_LEADS_QUERY, [ids, emails, nombres, apellidos, creacion]);
      this.logger.log(`Upsert masivo de ${leads.length} leads completado.`);
    } catch (error) {
      this.logger.error('Error en el upsert masivo de leads', error.stack);
    } finally {
      client.release();
    }
  }
}