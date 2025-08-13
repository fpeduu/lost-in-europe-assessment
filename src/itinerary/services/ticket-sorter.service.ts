import { BadRequestException, Injectable } from '@nestjs/common';
import { ITicket } from '../interfaces/ticket.interface';

@Injectable()
export class TicketSorterService {
  /**
   * Sorts tickets to create a valid travel itinerary
   * Uses a graph-based approach to find the correct order
   */
  sortTickets(tickets: ITicket[]): ITicket[] {
    if (!tickets || tickets.length === 0) {
      throw new BadRequestException('No tickets provided');
    }

    if (tickets.length === 1) {
      return tickets;
    }

    // Create a map of destinations to tickets for quick lookup
    const destinationMap = new Map<string, ITicket>();
    const startingPoints = new Set<string>();
    const destinations = new Set<string>();

    // Build the graph
    tickets.forEach((ticket) => {
      destinationMap.set(ticket.from, ticket);
      startingPoints.add(ticket.from);
      destinations.add(ticket.to);
    });

    // Find the starting point (location that is a 'from' but not a 'to')
    const actualStartingPoints = Array.from(startingPoints).filter(
      (start) => !destinations.has(start),
    );

    if (actualStartingPoints.length === 0) {
      throw new BadRequestException(
        'No valid starting point found - circular route detected',
      );
    }

    if (actualStartingPoints.length > 1) {
      throw new BadRequestException(
        'Multiple starting points found - disconnected routes detected',
      );
    }

    // Sort the tickets by following the chain
    const sortedTickets: ITicket[] = [];
    let currentLocation = actualStartingPoints[0];
    const usedTickets = new Set<ITicket>();

    while (destinationMap.has(currentLocation)) {
      const ticket = destinationMap.get(currentLocation);

      if (usedTickets.has(ticket)) {
        throw new BadRequestException('Circular route detected');
      }

      sortedTickets.push(ticket);
      usedTickets.add(ticket);
      currentLocation = ticket.to;
    }

    // Verify we used all tickets
    if (sortedTickets.length !== tickets.length) {
      throw new BadRequestException(
        'Disconnected route - some tickets cannot be reached',
      );
    }

    return sortedTickets;
  }

  /**
   * Generates a human-readable itinerary from sorted tickets
   */
  generateReadableItinerary(sortedTickets: ITicket[]): string[] {
    const readable: string[] = ['0. Start.'];

    sortedTickets.forEach((ticket, index) => {
      const step = index + 1;
      let instruction = `${step}. `;

      // Format based on transportation type
      switch (ticket.type) {
        case 'train':
          instruction += `Board train ${ticket.identifier || ''}, ${ticket.details || ''} from ${ticket.from} to ${ticket.to}`;
          break;
        case 'airplane':
          instruction += `From ${ticket.from}, board the flight ${ticket.identifier || ''} to ${ticket.to}`;
          if (ticket.details) {
            instruction += ` ${ticket.details}`;
          }
          break;
        case 'bus':
          instruction += `Board the ${ticket.identifier ? ticket.identifier + ' ' : ''}bus from ${ticket.from} to ${ticket.to}`;
          if (ticket.details) {
            instruction += `. ${ticket.details}`;
          }
          break;
        case 'tram':
          instruction += `Board the Tram ${ticket.identifier || ''} from ${ticket.from} to ${ticket.to}`;
          break;
        case 'boat':
          instruction += `Board the boat ${ticket.identifier || ''} from ${ticket.from} to ${ticket.to}`;
          if (ticket.details) {
            instruction += `. ${ticket.details}`;
          }
          break;
        case 'taxi':
          instruction += `Take taxi from ${ticket.from} to ${ticket.to}`;
          if (ticket.details) {
            instruction += `. ${ticket.details}`;
          }
          break;
        default:
          instruction += `Travel by ${ticket.type} from ${ticket.from} to ${ticket.to}`;
      }

      // Clean up extra spaces and add period if not present
      instruction = instruction.replace(/\s+/g, ' ').trim();
      if (!instruction.endsWith('.')) {
        instruction += '.';
      }

      readable.push(instruction);
    });

    readable.push(`${sortedTickets.length + 1}. Last destination reached.`);
    return readable;
  }
}
