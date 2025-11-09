
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';


export class DealProperties {
  @ApiProperty({ description: 'Nombre del trato en HubSpot.', example: 'Nuevo Contrato de Licencia', required: false })
  @IsString()
  @IsOptional()
  dealname?: string;

  @ApiProperty({ description: 'Monto del trato como string.', example: '1500.00', required: false })
  @IsString()
  @IsOptional()
  amount?: string;

  @ApiProperty({ description: 'ID de la etapa del pipeline del trato.', example: 'closedwon', required: false })
  @IsString()
  @IsOptional()
  dealstage?: string;

  @ApiProperty({ description: 'Fecha de cierre del trato (string ISO).', example: '2023-10-27T14:00:00.000Z', required: false })
  @IsString()
  @IsOptional()
  closedate?: string;

  @ApiProperty({ description: 'Fecha de creación del trato (string ISO).', example: '2023-09-15T10:00:00.000Z', required: false })
  @IsString()
  @IsOptional()
  createdate?: string; 
}


export class ContactProperties {
  @ApiProperty({ description: 'Email del contacto.', example: 'jane.doe@example.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Nombre del contacto.', example: 'Jane', required: false })
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiProperty({ description: 'Apellido del contacto.', example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiProperty({ description: 'Fecha de creación del contacto (string ISO).', example: '2023-08-01T09:30:00.000Z', required: false })
  @IsString()
  @IsOptional()
  createdate?: string;
}

export class RawDealDto {
  @ApiProperty({ description: 'ID único del Deal en HubSpot.', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  id: string; 

  @ApiProperty({ type: DealProperties })
  @IsObject()
  @ValidateNested()
  @Type(() => DealProperties)
  properties: DealProperties;
}

export class RawContactDto {
  @ApiProperty({ description: 'ID único del Contact en HubSpot.', example: '987654321' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: ContactProperties })
  @IsObject()
  @ValidateNested()
  @Type(() => ContactProperties)
  properties: ContactProperties;
}