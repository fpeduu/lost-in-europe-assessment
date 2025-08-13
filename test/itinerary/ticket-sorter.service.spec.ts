import { TransitType } from '@/itinerary/dto/ticket.dto';
import { TicketSorterService } from '@/itinerary/services/ticket-sorter.service';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('TicketSorterService', () => {
  let service: TicketSorterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketSorterService],
    }).compile();

    service = module.get<TicketSorterService>(TicketSorterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sortTickets', () => {
    it('should sort tickets in correct order', () => {
      const tickets = [
        {
          type: TransitType.AIRPLANE,
          from: 'Innsbruck Airport',
          to: 'Venice Airport',
          identifier: 'AA904',
          details: 'Gate 10, Seat 18B',
        },
        {
          type: TransitType.TRAIN,
          from: 'St. Anton am Arlberg Bahnhof',
          to: 'Innsbruck Hbf',
          identifier: 'RJX 765',
          details: 'Platform 3, Seat number 17C',
        },
        {
          type: TransitType.TRAM,
          from: 'Innsbruck Hbf',
          to: 'Innsbruck Airport',
          identifier: 'S5',
        },
      ];

      const result = service.sortTickets(tickets);

      expect(result).toHaveLength(3);
      expect(result[0].from).toBe('St. Anton am Arlberg Bahnhof');
      expect(result[1].from).toBe('Innsbruck Hbf');
      expect(result[2].from).toBe('Innsbruck Airport');
    });

    it('should handle single ticket', () => {
      const tickets = [
        {
          type: TransitType.TRAIN,
          from: 'A',
          to: 'B',
          identifier: 'T1',
        },
      ];

      const result = service.sortTickets(tickets);
      expect(result).toEqual(tickets);
    });

    it('should throw error for empty tickets array', () => {
      expect(() => service.sortTickets([])).toThrow(BadRequestException);
    });

    it('should throw error for circular route', () => {
      const tickets = [
        { type: TransitType.TRAIN, from: 'A', to: 'B' },
        { type: TransitType.TRAIN, from: 'B', to: 'A' },
      ];

      expect(() => service.sortTickets(tickets)).toThrow(BadRequestException);
    });

    it('should throw error for disconnected routes', () => {
      const tickets = [
        { type: TransitType.TRAIN, from: 'A', to: 'B' },
        { type: TransitType.TRAIN, from: 'C', to: 'D' },
      ];

      expect(() => service.sortTickets(tickets)).toThrow(BadRequestException);
    });
  });

  describe('generateReadableItinerary', () => {
    it('should generate human-readable itinerary', () => {
      const tickets = [
        {
          type: TransitType.TRAIN,
          from: 'St. Anton am Arlberg Bahnhof',
          to: 'Innsbruck Hbf',
          identifier: 'RJX 765',
          details: 'Platform 3, Seat number 17C',
        },
        {
          type: TransitType.AIRPLANE,
          from: 'Innsbruck Airport',
          to: 'Venice Airport',
          identifier: 'AA904',
          details: 'Gate 10, Seat 18B',
        },
      ];

      const result = service.generateReadableItinerary(tickets);

      expect(result[0]).toBe('0. Start.');
      expect(result[1]).toContain('Board train RJX 765');
      expect(result[2]).toContain('board the flight AA904');
      expect(result[result.length - 1]).toBe('3. Last destination reached.');
    });
  });
});
