import { Injectable } from '@nestjs/common';
import { IItinerary } from '../interfaces/ticket.interface';

@Injectable()
export class ItineraryStorageService {
  private readonly itineraries = new Map<string, IItinerary>();

  /**
   * Stores an itinerary and returns its ID
   */
  store(itinerary: Omit<IItinerary, 'id'>): string {
    const id = this.generateId();
    const fullItinerary: IItinerary = {
      ...itinerary,
      id,
    };

    this.itineraries.set(id, fullItinerary);
    return id;
  }

  /**
   * Retrieves an itinerary by ID
   */
  getById(id: string): IItinerary | null {
    return this.itineraries.get(id) || null;
  }

  /**
   * Gets all stored itineraries
   */
  getAll(): IItinerary[] {
    return Array.from(this.itineraries.values());
  }

  /**
   * Deletes an itinerary by ID
   */
  delete(id: string): boolean {
    return this.itineraries.delete(id);
  }

  /**
   * Generates a unique identifier for the itinerary
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `itinerary_${timestamp}_${random}`;
  }
}
