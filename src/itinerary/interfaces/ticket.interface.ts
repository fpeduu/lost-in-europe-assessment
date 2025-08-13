import { TransitType } from '../dto/ticket.dto';

export interface ITicket {
  type: TransitType;
  from: string;
  to: string;
  identifier?: string;
  details?: string;
}

export interface IItinerary {
  id: string;
  sortedTickets: ITicket[];
  readableItinerary: string[];
  createdAt: Date;
}
