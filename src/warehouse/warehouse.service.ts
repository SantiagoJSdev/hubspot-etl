import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { TransformedDealDto, TransformedLeadDto } from './dto/transformed.dto';

@Injectable()
export class WarehouseService implements OnModuleInit {
  private readonly logger = new Logger(WarehouseService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  // Usamos OnModuleInit para asegurar que el pool se cree
  // una vez que el ConfigService esté listo.
  onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
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
      // 1. Preparamos los arrays para la consulta 'unnest'
     // Esto es mucho más eficiente que un INSERT por cada fila [cite: 54, 56]
      const ids = deals.map((d) => d.hubspot_deal_id);
      const nombres = deals.map((d) => d.nombre_trato);
      const montos = deals.map((d) => d.monto);
      const etapas = deals.map((d) => d.etapa);
      const creacion = deals.map((d) => d.fecha_creacion_hubspot);
      const cierre = deals.map((d) => d.fecha_cierre_hubspot);

      // 2. Esta es la consulta SQL de UPSERT masivo [cite: 53]
      const query = `
        INSERT INTO deals (
          hubspot_deal_id, nombre_trato, monto, etapa, 
          fecha_creacion_hubspot, fecha_cierre_hubspot, fecha_etl_actualizado
        )
        -- Usamos unnest para convertir arrays en filas
        SELECT * FROM unnest(
          $1::text[], $2::text[], $3::decimal[], $4::text[], 
          $5::timestamptz[], $6::timestamptz[]
        ) AS t(id, nombre, monto, etapa, creacion, cierre),
        -- Añadimos la fecha de actualización
        NOW() 
        
        -- Esta es la clave de la Idempotencia
        ON CONFLICT (hubspot_deal_id) DO UPDATE SET
          nombre_trato = EXCLUDED.nombre_trato,
          monto = EXCLUDED.monto,
          etapa = EXCLUDED.etapa,
          fecha_creacion_hubspot = EXCLUDED.fecha_creacion_hubspot,
          fecha_cierre_hubspot = EXCLUDED.fecha_cierre_hubspot,
          fecha_etl_actualizado = NOW();
      `;

      await client.query(query, [ids, nombres, montos, etapas, creacion, cierre]);
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
      // 1. Preparamos los arrays
      const ids = leads.map((l) => l.hubspot_contact_id);
      const emails = leads.map((l) => l.email);
      const nombres = leads.map((l) => l.nombre);
      const apellidos = leads.map((l) => l.apellido);
      const creacion = leads.map((l) => l.fecha_creacion_hubspot);

      // 2. Consulta UPSERT masivo para Leads
      const query = `
        INSERT INTO leads (
          hubspot_contact_id, email, nombre, apellido, 
          fecha_creacion_hubspot, fecha_etl_actualizado
        )
        SELECT * FROM unnest(
          $1::text[], $2::text[], $3::text[], $4::text[], $5::timestamptz[]
        ) AS t(id, email, nombre, apellido, creacion),
        NOW() 
        
        ON CONFLICT (hubspot_contact_id) DO UPDATE SET
          email = EXCLUDED.email,
          nombre = EXCLUDED.nombre,
          apellido = EXCLUDED.apellido,
          fecha_creacion_hubspot = EXCLUDED.fecha_creacion_hubspot,
          fecha_etl_actualizado = NOW();
      `;
      
      await client.query(query, [ids, emails, nombres, apellidos, creacion]);
      this.logger.log(`Upsert masivo de ${leads.length} leads completado.`);
    } catch (error) {
      this.logger.error('Error en el upsert masivo de leads', error.stack);
    } finally {
      client.release();
    }
  }
}