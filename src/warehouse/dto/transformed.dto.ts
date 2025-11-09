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
import { ApiProperty } from '@nestjs/swagger';

export class TransformedDealDto {
  @ApiProperty({ description: 'ID del Deal en HubSpot.', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  hubspot_deal_id: string;

  @ApiProperty({ description: 'Nombre del trato.', example: 'Nuevo Contrato de Licencia', required: false, nullable: true })
  @IsString()
  @IsOptional()
  nombre_trato: string | null;

  @ApiProperty({ description: 'Monto del trato.', example: 1500.00, required: false, nullable: true })
  @IsNumber()
  @IsOptional()
  monto: number | null;

  @ApiProperty({ description: 'Etapa del pipeline del trato.', example: 'closedwon', required: false, nullable: true })
  @IsString()
  @IsOptional()
  etapa: string | null;

  @ApiProperty({ description: 'Fecha de creación en HubSpot.', example: '2023-09-15T10:00:00.000Z', required: false, nullable: true })
  @IsDate()
  @Type(() => Date) // Asegura la transformación a tipo Date
  @IsOptional()
  fecha_creacion_hubspot: Date | null;

  @ApiProperty({ description: 'Fecha de cierre en HubSpot.', example: '2023-10-27T14:00:00.000Z', required: false, nullable: true })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fecha_cierre_hubspot: Date | null;
}

export class TransformedLeadDto {
  @ApiProperty({ description: 'ID del Contact en HubSpot.', example: '987654321' })
  @IsString()
  @IsNotEmpty()
  hubspot_contact_id: string;

  @ApiProperty({ description: 'Email del lead.', example: 'jane.doe@example.com', required: false, nullable: true })
  @IsEmail()
  @IsOptional()
  email: string | null;

  @ApiProperty({ description: 'Nombre del lead.', example: 'Jane', required: false, nullable: true })
  @IsString()
  @IsOptional()
  nombre: string | null;

  @ApiProperty({ description: 'Apellido del lead.', example: 'Doe', required: false, nullable: true })
  @IsString()
  @IsOptional()
  apellido: string | null;

  @ApiProperty({ description: 'Fecha de creación en HubSpot.', example: '2023-08-01T09:30:00.000Z', required: false, nullable: true })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fecha_creacion_hubspot: Date | null;
}