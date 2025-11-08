import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { HubspotService } from './hubspot.service';

@Module({
  imports: [HttpModule], 
  providers: [HubspotService],
  exports: [HubspotService], 
})
export class HubspotModule {}