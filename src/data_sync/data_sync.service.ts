import { Injectable, Logger } from '@nestjs/common';
import { HubspotService } from '../hubspot/hubspot.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { 
  TransformedDealDto, 
  TransformedLeadDto 
} from '../warehouse/dto/transformed.dto';
import { RawContactDto, RawDealDto } from 'src/hubspot/dto/raw-hubspot.dto';

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);

  constructor(
    private readonly hubspotService: HubspotService,
    private readonly warehouseService: WarehouseService,
  ) {}

  /**
   * Método principal para ejecutar el flujo ETL completo (Extract, Transform, Load).
   */
  async runFullSync(): Promise<void> {
    this.logger.log('--- Proceso ETL iniciado ---');
    const rawDeals: RawDealDto[] = await this.hubspotService.getAllDeals();
    const rawLeads: RawContactDto[] = await this.hubspotService.getAllContacts();
    this.logger.log(`Extraídos: ${rawDeals.length} Deals, ${rawLeads.length} Leads.`);
    const transformedDeals = this.transformDeals(rawDeals);
    const transformedLeads = this.transformLeads(rawLeads);
    this.logger.log('Datos transformados con éxito.');
    this.logger.log('Cargando datos en PostgreSQL...');
    await this.warehouseService.bulkUpsertDeals(transformedDeals);
    await this.warehouseService.bulkUpsertLeads(transformedLeads);
    this.logger.log('Carga completada. --- Proceso ETL finalizado ---');
  }

  /**
   * Lógica de Transformación (T) para Deals.
   * Responsabilidad: Aplanar, limpiar y estandarizar datos crudos de HubSpot a nuestro esquema DW.
   */
  private transformDeals(rawDeals: RawDealDto[]): TransformedDealDto[] {
    return rawDeals.map((deal) => {
      const properties = deal.properties;
      const amountValue = properties.amount ? parseFloat(properties.amount) : null;
      return {
        hubspot_deal_id: deal.id, 
        nombre_trato: properties.dealname || 'Sin Nombre',
        monto: amountValue,
        etapa: properties.dealstage || 'Sin Etapa',
        fecha_creacion_hubspot: properties.createdate ? new Date(properties.createdate) : null,
        fecha_cierre_hubspot: properties.closedate ? new Date(properties.closedate) : null,
      };
    });
  }
  
  /**
   * Lógica de Transformación (T) para Leads (Contacts).
   */
  private transformLeads(rawLeads: RawContactDto[]): TransformedLeadDto[] {
    return rawLeads.map((lead) => {
      const properties = lead.properties;
      return {
        hubspot_contact_id: lead.id,
        email: properties.email || null,
        nombre: properties.firstname || null,
        apellido: properties.lastname || null,
        fecha_creacion_hubspot: properties.createdate ? new Date(properties.createdate) : null,
      };
    });
  }
}