import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@hubspot/api-client'; // Importar el SDK
import { CONTACT_PROPERTIES, DEAL_PROPERTIES } from './constants/hubspot.constants';
import { RawContactDto, RawDealDto } from './dto/raw-hubspot.dto';

@Injectable()
export class HubspotService {
  private readonly logger = new Logger(HubspotService.name);
  private hubspotClient: Client; // Usaremos el cliente del SDK
  
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
  async getAllDeals(): Promise<RawDealDto[]> {
    this.logger.log('Iniciando extracción de Deals...');
    const allDeals = [];
    let hasMore = true;
    let after: string = undefined;

    try {
      while (hasMore) {
        const response = await this.hubspotClient.crm.deals.basicApi.getPage(
          100,        
          after,      
          DEAL_PROPERTIES, 
          undefined,  
          undefined,  
          false       
        );

        allDeals.push(...(response.results as RawDealDto[]) );
        
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
      this.logger.error('Error en la extracción de Deals (SDK):', error.message);
      return []; 
    }
  }

  // --- Método de Extracción de CONTACTS (Leads) ---
  async getAllContacts(): Promise<RawContactDto[]> {
    this.logger.log('Iniciando extracción de Contacts (Leads)...');
    const allContacts = [];
    let hasMore = true;
    let after: string = undefined;
    
    try {
      while (hasMore) {
        // Usar el SDK para la llamada
        const response = await this.hubspotClient.crm.contacts.basicApi.getPage(
          100,       
          after,   
          CONTACT_PROPERTIES, 
          undefined, 
          undefined, 
          false     
        );

        allContacts.push(...(response.results as RawContactDto[]))
        
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