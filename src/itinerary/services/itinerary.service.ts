import { Injectable } from '@nestjs/common';
import { ItineraryResponseDto } from '../dto/itinerary-response.dto';
import { IItinerary, ITicket } from '../interfaces/ticket.interface';
import { ItineraryStorageService } from './itinerary-storage.service';
import { TicketSorterService } from './ticket-sorter.service';

@Injectable()
export class ItineraryService {
  constructor(
    private readonly ticketSorter: TicketSorterService,
    private readonly storage: ItineraryStorageService,
  ) {}

  /**
   * Sorts tickets and creates a new itinerary
   */
  sortAndStoreItinerary(tickets: ITicket[]): ItineraryResponseDto {
    const sortedTickets = this.ticketSorter.sortTickets(tickets);
    const readableItinerary =
      this.ticketSorter.generateReadableItinerary(sortedTickets);

    const itineraryData = {
      sortedTickets,
      readableItinerary,
      createdAt: new Date(),
    };

    const id = this.storage.store(itineraryData);

    return {
      id,
      sortedTickets,
      readableItinerary,
      createdAt: itineraryData.createdAt,
    };
  }

  /**
   * Retrieves a stored itinerary by ID
   */
  getItinerary(id: string): IItinerary | null {
    return this.storage.getById(id);
  }

  /**
   * Gets all stored itineraries
   */
  getAllItineraries(): IItinerary[] {
    return this.storage.getAll();
  }
}
