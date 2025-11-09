import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@hubspot/api-client'; // Importar el SDK

@Injectable()
export class HubspotService {
  private readonly logger = new Logger(HubspotService.name);
  private hubspotClient: Client; // Usaremos el cliente del SDK
  
  // Scopes de propiedades que queremos extraer
  private readonly dealProperties = ['dealname', 'amount', 'dealstage', 'createdate', 'closedate'];
  private readonly contactProperties =  ['email', 'firstname', 'lastname', 'createdate'];

  constructor(private readonly configService: ConfigService) {
    const hubspotToken = this.configService.get<string>('hubspot.privateAppToken');
    
    if (!hubspotToken) {
        throw new Error('HUBSPOT_PRIVATE_APP_TOKEN no está definido en .env');
    }
    
    // Inicializar el cliente del SDK
    this.hubspotClient = new Client({ accessToken: hubspotToken });
    this.logger.log('Cliente de HubSpot SDK inicializado.');
  }

  // --- Método de Extracción de DEALS (Tratos) ---
  async getAllDeals(): Promise<any[]> {
    this.logger.log('Iniciando extracción de Deals...');
    const allDeals = [];
    let hasMore = true;
    let after: string = undefined;

    try {
      while (hasMore) {
        // Usar el SDK para la llamada
        const response = await this.hubspotClient.crm.deals.basicApi.getPage(
          100,        // Límite por página
          after,      // Cursor para paginación
          this.dealProperties, // Propiedades a obtener
          undefined,  // propertiesWithHistory
          undefined,  // Associations
          false       // Archived
        );

        allDeals.push(...response.results);
        
        // Manejo de paginación del SDK
        if (response.paging && response.paging.next) {
          after = response.paging.next.after;
        } else {
          hasMore = false;
        }
      }
      this.logger.log(`Extracción de Deals completada. Total: ${allDeals.length}`);
      return allDeals;
    } catch (error) {
      // El SDK gestiona mejor los errores de autenticación (401)
      this.logger.error('Error en la extracción de Deals (SDK):', error.message);
      return []; 
    }
  }

  // --- Método de Extracción de CONTACTS (Leads) ---
  async getAllContacts(): Promise<any[]> {
    this.logger.log('Iniciando extracción de Contacts (Leads)...');
    const allContacts = [];
    let hasMore = true;
    let after: string = undefined;
    
    try {
      while (hasMore) {
        // Usar el SDK para la llamada
        const response = await this.hubspotClient.crm.contacts.basicApi.getPage(
          100,       // Límite por página
          after,     // Cursor para paginación
          this.contactProperties, // Propiedades a obtener
          undefined, // propertiesWithHistory
          undefined, // Associations
          false      // Archived
        );

        allContacts.push(...response.results);
        
        // Manejo de paginación del SDK
        if (response.paging && response.paging.next) {
          after = response.paging.next.after;
        } else {
          hasMore = false;
        }
      }
      this.logger.log(`Extracción de Contacts completada. Total: ${allContacts.length}`);
      return allContacts;
    } catch (error) {
      this.logger.error('Error en la extracción de Contacts (SDK):', error.message);
      return []; 
    }
  }
}