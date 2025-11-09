// DTO para la data ya transformada, lista para el DW
export interface TransformedDealDto {
  hubspot_deal_id: string;
  nombre_trato: string | null;
  monto: number | null;
  etapa: string | null;
  fecha_creacion_hubspot: Date | null;
  fecha_cierre_hubspot: Date | null;
}

export interface TransformedLeadDto {
  hubspot_contact_id: string;
  email: string | null;
  nombre: string | null;
  apellido: string | null;
  fecha_creacion_hubspot: Date | null;
}