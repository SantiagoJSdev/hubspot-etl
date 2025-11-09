 
import { IsInt, IsNumber, Min } from 'class-validator';

export class RevenueSummaryDto {
  @IsNumber()
  @Min(0, { message: 'El ingreso total no puede ser negativo.' })
  total_revenue: number;

  @IsInt()
  @Min(0, { message: 'El conteo de tratos no puede ser negativo.' })
  won_deals_count: number;
}

export class LeadsCountDto {
  @IsInt()
  @Min(0, { message: 'El conteo de leads no puede ser negativo.' })
  total_leads: number;
}