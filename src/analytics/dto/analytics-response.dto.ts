 
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class RevenueSummaryDto {
  @ApiProperty({
    description: 'Suma total de montos de tratos ganados (closedwon).',
    example: 123456.78,
  })
  @IsNumber()
  @Min(0, { message: 'El ingreso total no puede ser negativo.' })
  total_revenue: number;

  @ApiProperty({ description: 'Conteo total de tratos ganados.', example: 42 })
  @IsInt()
  @Min(0, { message: 'El conteo de tratos no puede ser negativo.' })
  won_deals_count: number;
}

export class LeadsCountDto {
  @ApiProperty({
    description: 'Conteo total de leads (contactos) en el Data Warehouse.',
    example: 150,
  })
  @IsInt()
  @Min(0, { message: 'El conteo de leads no puede ser negativo.' })
  total_leads: number;
}