import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ItineraryResponseDto } from './dto/itinerary-response.dto';
import { SortTicketsDto } from './dto/sort-tickets.dto';
import { IItinerary } from './interfaces/ticket.interface';
import { ItineraryService } from './services/itinerary.service';

@ApiTags('itinerary')
@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post('sort')
  @ApiOperation({
    summary: 'Sort tickets into correct travel order',
    description:
      'Accepts unsorted tickets and returns them in correct travel sequence with a unique identifier',
  })
  @ApiResponse({
    status: 201,
    description: 'Tickets successfully sorted',
    type: ItineraryResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid ticket data or unsortable tickets (circular/disconnected routes)',
  })
  sortTickets(@Body() sortTicketsDto: SortTicketsDto): ItineraryResponseDto {
    try {
      return this.itineraryService.sortAndStoreItinerary(
        sortTicketsDto.tickets,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sort tickets';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve stored itinerary by ID',
    description:
      'Gets a previously sorted itinerary using its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique itinerary identifier',
    example: 'itinerary_123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Itinerary found',
    type: ItineraryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Itinerary not found',
  })
  getItinerary(@Param('id') id: string): IItinerary {
    const itinerary = this.itineraryService.getItinerary(id);

    if (!itinerary) {
      throw new HttpException('Itinerary not found', HttpStatus.NOT_FOUND);
    }

    return itinerary;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all stored itineraries',
    description: 'Retrieves all previously sorted itineraries',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all stored itineraries',
    type: [ItineraryResponseDto],
  })
  getAllItineraries(): IItinerary[] {
    return this.itineraryService.getAllItineraries();
  }
}
