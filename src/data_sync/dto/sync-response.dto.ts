
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsIn(['SUCCESS', 'ERROR'])
  @IsNotEmpty()
  status: 'SUCCESS' | 'ERROR';

  @IsString()
  @IsOptional()
  details?: string;
}