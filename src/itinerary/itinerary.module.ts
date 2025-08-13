import { Module } from '@nestjs/common';
import { ItineraryController } from './itinerary.controller';
import { ItineraryStorageService } from './services/itinerary-storage.service';
import { ItineraryService } from './services/itinerary.service';
import { TicketSorterService } from './services/ticket-sorter.service';

@Module({
  controllers: [ItineraryController],
  providers: [ItineraryService, TicketSorterService, ItineraryStorageService],
})
export class ItineraryModule {}
