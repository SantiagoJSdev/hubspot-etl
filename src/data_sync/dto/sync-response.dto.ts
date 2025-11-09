
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncResponseDto {
  @ApiProperty({
    description: 'Mensaje descriptivo del resultado de la sincronización.',
    example: 'Sincronización ETL completada con éxito.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Estado de la sincronización.',
    enum: ['SUCCESS', 'ERROR'],
    example: 'SUCCESS',
  })
  @IsIn(['SUCCESS', 'ERROR'])
  @IsNotEmpty()
  status: 'SUCCESS' | 'ERROR';

  @ApiProperty({
    description: 'Detalles adicionales en caso de error.',
    example: 'Token de HubSpot inválido o expirado.',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;
}