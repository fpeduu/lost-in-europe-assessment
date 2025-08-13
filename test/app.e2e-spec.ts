import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ItineraryResponseDto } from '../src/itinerary/dto/itinerary-response.dto';
import { TransitType } from '../src/itinerary/dto/ticket.dto';
import { AppModule } from './../src/app.module';

describe('Itinerary API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/itinerary/sort (POST)', () => {
    it('should sort tickets correctly', () => {
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

      return request(app.getHttpServer())
        .post('/itinerary/sort')
        .send({ tickets })
        .expect(201)
        .expect((res: { body: ItineraryResponseDto }) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('sortedTickets');
          expect(res.body).toHaveProperty('readableItinerary');
          expect(res.body).toHaveProperty('createdAt');

          expect(res.body.sortedTickets).toHaveLength(3);
          expect(res.body.sortedTickets[0].from).toBe(
            'St. Anton am Arlberg Bahnhof',
          );
          expect(res.body.readableItinerary[0]).toBe('0. Start.');
          expect(
            res.body.readableItinerary[res.body.readableItinerary.length - 1],
          ).toBe('4. Last destination reached.');
        });
    });

    it('should handle invalid ticket data', () => {
      const invalidTickets = [
        {
          type: 'invalid_type',
          from: 'A',
          to: 'B',
        },
      ];

      return request(app.getHttpServer())
        .post('/itinerary/sort')
        .send({ tickets: invalidTickets })
        .expect(400);
    });

    it('should handle circular routes', () => {
      const circularTickets = [
        {
          type: TransitType.TRAIN,
          from: 'A',
          to: 'B',
        },
        {
          type: TransitType.TRAIN,
          from: 'B',
          to: 'A',
        },
      ];

      return request(app.getHttpServer())
        .post('/itinerary/sort')
        .send({ tickets: circularTickets })
        .expect(400);
    });
  });

  describe('/itinerary/:id (GET)', () => {
    it('should retrieve stored itinerary', async () => {
      // First create an itinerary
      const tickets = [
        {
          type: TransitType.TRAIN,
          from: 'A',
          to: 'B',
          identifier: 'T1',
        },
      ];

      const createResponse = await request(app.getHttpServer())
        .post('/itinerary/sort')
        .send({ tickets })
        .expect(201);

      const itineraryId = (createResponse.body as ItineraryResponseDto).id;

      // Then retrieve it
      return request(app.getHttpServer())
        .get(`/itinerary/${itineraryId}`)
        .expect(200)
        .expect((res: { body: ItineraryResponseDto }) => {
          expect(res.body.id).toBe(itineraryId);
          expect(res.body).toHaveProperty('sortedTickets');
          expect(res.body).toHaveProperty('readableItinerary');
        });
    });

    it('should return 404 for non-existent itinerary', () => {
      return request(app.getHttpServer())
        .get('/itinerary/non-existent-id')
        .expect(404);
    });
  });

  describe('/itinerary (GET)', () => {
    it('should return all stored itineraries', async () => {
      // Create a few itineraries first
      const tickets = [
        {
          type: TransitType.TRAIN,
          from: 'A',
          to: 'B',
          identifier: 'T1',
        },
      ];

      await request(app.getHttpServer())
        .post('/itinerary/sort')
        .send({ tickets });

      return request(app.getHttpServer())
        .get('/itinerary')
        .expect(200)
        .expect((res: { body: ItineraryResponseDto[] }) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });
  });
});
