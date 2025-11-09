import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para la data ya transformada, lista para el DW
export class TransformedDealDto {
  @IsString()
  @IsNotEmpty()
  hubspot_deal_id: string;

  @IsString()
  @IsOptional()
  nombre_trato: string | null;

  @IsNumber()
  @IsOptional()
  monto: number | null;

  @IsString()
  @IsOptional()
  etapa: string | null;

  @IsDate()
  @Type(() => Date) // Asegura la transformación a tipo Date
  @IsOptional()
  fecha_creacion_hubspot: Date | null;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fecha_cierre_hubspot: Date | null;
}

export class TransformedLeadDto {
  @IsString()
  @IsNotEmpty()
  hubspot_contact_id: string;

  @IsEmail()
  @IsOptional()
  email: string | null;

  @IsString()
  @IsOptional()
  nombre: string | null;

  @IsString()
  @IsOptional()
  apellido: string | null;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fecha_creacion_hubspot: Date | null;
}