import { Injectable, Logger } from '@nestjs/common';
import { HubspotService } from '../hubspot/hubspot.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { 
  TransformedDealDto, 
  TransformedLeadDto 
} from '../warehouse/dto/transformed.dto';

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
    
    // **FIN NUEVA LÍNEA**

    // --- 1. Extracción (Extract) ---
    // --- 1. Extracción (Extract) ---
    this.logger.log('Paso E: Extrayendo datos de HubSpot...');
    const rawDeals = await this.hubspotService.getAllDeals();
    const rawLeads = await this.hubspotService.getAllContacts();
    this.logger.log(`Extraídos: ${rawDeals.length} Deals, ${rawLeads.length} Leads.`);

    // --- 2. Transformación (Transform) ---
    this.logger.log('Paso T: Transformando datos...');
    const transformedDeals = this.transformDeals(rawDeals);
    const transformedLeads = this.transformLeads(rawLeads);
    this.logger.log('Datos transformados con éxito.');

    // --- 3. Carga (Load) ---
    this.logger.log('Paso L: Cargando datos en PostgreSQL...');
    await this.warehouseService.bulkUpsertDeals(transformedDeals);
    await this.warehouseService.bulkUpsertLeads(transformedLeads); // Asumiendo que implementaste este método en 3.b
    this.logger.log('Carga completada. --- Proceso ETL finalizado ---');
  }

  /**
   * Lógica de Transformación (T) para Deals.
   * Responsabilidad: Aplanar, limpiar y estandarizar datos crudos de HubSpot a nuestro esquema DW.
   */
  private transformDeals(rawDeals: any[]): TransformedDealDto[] {
    return rawDeals.map((deal) => {
      const properties = deal.properties;
      
     // La lógica de transformación: Aplanar [cite: 58, 67][cite_start], Limpiar tipos [cite: 69][cite_start], Estandarizar [cite: 75, 76]
      const amountValue = properties.amount ? parseFloat(properties.amount) : null;
      
      return {
        hubspot_deal_id: deal.id, // ID del objeto de HubSpot
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
  private transformLeads(rawLeads: any[]): TransformedLeadDto[] {
    return rawLeads.map((lead) => {
      const properties = lead.properties;
      
      return {
        hubspot_contact_id: lead.id, // ID del objeto de HubSpot
        email: properties.email || null,
        nombre: properties.firstname || null,
        apellido: properties.lastname || null,
        fecha_creacion_hubspot: properties.createdate ? new Date(properties.createdate) : null,
      };
    });
  }
}