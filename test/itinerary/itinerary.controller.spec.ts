import { TransitType } from '@/itinerary/dto/ticket.dto';
import { ItineraryController } from '@/itinerary/itinerary.controller';
import { ItineraryService } from '@/itinerary/itinerary.service';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('ItineraryController', () => {
  let controller: ItineraryController;
  let service: ItineraryService;

  const mockItineraryService = {
    sortAndStoreItinerary: jest.fn(),
    getItinerary: jest.fn(),
    getAllItineraries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItineraryController],
      providers: [
        {
          provide: ItineraryService,
          useValue: mockItineraryService,
        },
      ],
    }).compile();

    controller = module.get<ItineraryController>(ItineraryController);
    service = module.get<ItineraryService>(ItineraryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sortTickets', () => {
    it('should sort tickets successfully', async () => {
      const tickets = [
        {
          type: TransitType.TRAIN,
          from: 'A',
          to: 'B',
          identifier: 'T1',
          details: 'Platform 1',
        },
      ];

      const mockResult = {
        id: 'test-id',
        sortedTickets: tickets,
        readableItinerary: [
          '0. Start.',
          '1. Board train T1...',
          '2. Last destination reached.',
        ],
        createdAt: new Date(),
      };

      mockItineraryService.sortAndStoreItinerary.mockResolvedValue(mockResult);

      const result = await controller.sortTickets({ tickets });

      expect(result).toEqual(mockResult);
      expect(service.sortAndStoreItinerary).toHaveBeenCalledWith(tickets);
    });

    it('should handle sorting errors', async () => {
      const tickets = [
        {
          type: TransitType.TRAIN,
          from: 'A',
          to: 'B',
        },
      ];

      mockItineraryService.sortAndStoreItinerary.mockRejectedValue(
        new Error('Circular route detected'),
      );

      await expect(controller.sortTickets({ tickets })).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getItinerary', () => {
    it('should return itinerary when found', async () => {
      const mockItinerary = {
        id: 'test-id',
        sortedTickets: [],
        readableItinerary: [],
        createdAt: new Date(),
      };

      mockItineraryService.getItinerary.mockResolvedValue(mockItinerary);

      const result = await controller.getItinerary('test-id');

      expect(result).toEqual(mockItinerary);
    });

    it('should throw 404 when itinerary not found', async () => {
      mockItineraryService.getItinerary.mockResolvedValue(null);

      await expect(controller.getItinerary('non-existent')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
