
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';


export class DealProperties {
  @IsString()
  @IsOptional()
  dealname?: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  dealstage?: string;

  @IsString()
  @IsOptional()
  closedate?: string;

  @IsString()
  @IsOptional()
  createdate?: string; 
}


export class ContactProperties {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  createdate?: string;
}

export class RawDealDto {
  @IsString()
  @IsNotEmpty()
  id: string; 

  @IsObject()
  @ValidateNested()
  @Type(() => DealProperties)
  properties: DealProperties;
}

export class RawContactDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactProperties)
  properties: ContactProperties;
}