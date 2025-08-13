import { ApiProperty } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';

export class ItineraryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the sorted itinerary',
    example: 'itinerary_123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Array of sorted tickets in travel order',
    type: [TicketDto],
  })
  sortedTickets: TicketDto[];

  @ApiProperty({
    description: 'Human-readable itinerary',
    example: [
      '0. Start.',
      '1. Board train RJX 765, Platform 3 from St. Anton am Arlberg Bahnhof to Innsbruck Hbf. Seat number 17C.',
      '2. Last destination reached.',
    ],
  })
  readableItinerary: string[];

  @ApiProperty({
    description: 'Timestamp when itinerary was created',
    example: '2024-12-15T10:30:00Z',
  })
  createdAt: Date;
}
