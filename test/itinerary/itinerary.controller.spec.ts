import { TransitType } from '@/itinerary/dto/ticket.dto';
import { ItineraryController } from '@/itinerary/itinerary.controller';
import { ItineraryService } from '@/itinerary/services/itinerary.service';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('ItineraryController', () => {
  let controller: ItineraryController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sortTickets', () => {
    it('should sort tickets successfully', () => {
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

      mockItineraryService.sortAndStoreItinerary.mockReturnValue(mockResult);

      const result = controller.sortTickets({ tickets });

      expect(result).toEqual(mockResult);
      expect(mockItineraryService.sortAndStoreItinerary).toHaveBeenCalledWith(
        tickets,
      );
    });

    it('should handle sorting errors', () => {
      const tickets = [
        {
          type: TransitType.TRAIN,
          from: 'A',
          to: 'B',
        },
      ];

      mockItineraryService.sortAndStoreItinerary.mockImplementation(() => {
        throw new Error('Circular route detected');
      });

      expect(() => controller.sortTickets({ tickets })).toThrow(HttpException);
    });
  });

  describe('getItinerary', () => {
    it('should return itinerary when found', () => {
      const mockItinerary = {
        id: 'test-id',
        sortedTickets: [],
        readableItinerary: [],
        createdAt: new Date(),
      };

      mockItineraryService.getItinerary.mockReturnValue(mockItinerary);

      const result = controller.getItinerary('test-id');

      expect(result).toEqual(mockItinerary);
    });

    it('should throw 404 when itinerary not found', () => {
      mockItineraryService.getItinerary.mockReturnValue(null);

      expect(() => controller.getItinerary('non-existent')).toThrow(
        HttpException,
      );
    });
  });
});
