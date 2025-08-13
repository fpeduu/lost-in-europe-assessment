# Kevin's Travel Itinerary API

A REST API built with Nest.js to help Kevin McCallister sort his travel tickets into the correct itinerary order.

## Overview

This API solves the problem of sorting unsorted transportation tickets into a valid travel sequence. It uses a graph-based algorithm to determine the correct order and provides both machine-readable and human-readable formats.

## Features

- **Ticket Sorting**: Automatically sorts tickets into correct travel order
- **Multiple Transport Types**: Supports train, airplane, bus, boat, taxi, and tram
- **Human-Readable Output**: Generates step-by-step travel instructions
- **Persistent Storage**: Stores sorted itineraries with unique identifiers
- **Full Documentation**: Swagger/OpenAPI documentation
- **Comprehensive Testing**: Unit and E2E tests
- **Input Validation**: Strong validation with detailed error messages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`
Swagger documentation will be available at `http://localhost:3000/api`

### Running Tests

#### Unit Tests
```bash
npm run test
```

#### E2E Tests
```bash
npm run test:e2e
```

#### Test Coverage
```bash
npm run test:cov
```

## API Documentation

### Endpoints

#### POST /itinerary/sort
Sorts tickets and returns the complete itinerary with a unique identifier.

**Request Body:**
```json
{
  "tickets": [
    {
      "type": "train",
      "from": "St. Anton am Arlberg Bahnhof",
      "to": "Innsbruck Hbf",
      "identifier": "RJX 765",
      "details": "Platform 3, Seat number 17C"
    },
    {
      "type": "tram",
      "from": "Innsbruck Hbf",
      "to": "Innsbruck Airport",
      "identifier": "S5"
    },
    {
      "type": "airplane",
      "from": "Innsbruck Airport",
      "to": "Venice Airport",
      "identifier": "AA904",
      "details": "Gate 10, Seat 18B"
    }
  ]
}
```

**Response:**
```json
{
  "id": "itinerary_lq2x8k_abc123",
  "sortedTickets": [...],
  "readableItinerary": [
    "0. Start.",
    "1. Board train RJX 765, Platform 3 from St. Anton am Arlberg Bahnhof to Innsbruck Hbf. Seat number 17C.",
    "2. Board the Tram S5 from Innsbruck Hbf to Innsbruck Airport.",
    "3. From Innsbruck Airport, board the flight AA904 to Venice Airport Gate 10, Seat 18B.",
    "4. Last destination reached."
  ],
  "createdAt": "2024-12-15T10:30:00.000Z"
}
```

#### GET /itinerary/:id
Retrieves a specific itinerary by its unique identifier.

#### GET /itinerary
Retrieves all stored itineraries.

## Working Example

### Example Request using curl:

```bash
curl -X POST http://localhost:3000/itinerary/sort \
  -H "Content-Type: application/json" \
  -d '{
    "tickets": [
      {
        "type": "airplane",
        "from": "Innsbruck Airport",
        "to": "Venice Airport",
        "identifier": "AA904",
        "details": "Gate 10, Seat 18B"
      },
      {
        "type": "train",
        "from": "St. Anton am Arlberg Bahnhof",
        "to": "Innsbruck Hbf",
        "identifier": "RJX 765",
        "details": "Platform 3, Seat number 17C"
      },
      {
        "type": "tram",
        "from": "Innsbruck Hbf",
        "to": "Innsbruck Airport",
        "identifier": "S5"
      }
    ]
  }'
```

## Architecture & Design

### Core Components

1. **TicketSorterService**: Implements the graph-based sorting algorithm
2. **ItineraryStorageService**: Handles in-memory storage of sorted itineraries
3. **ItineraryService**: Orchestrates the sorting and storage operations
4. **ItineraryController**: Handles HTTP requests and responses

### Sorting Algorithm

The algorithm uses a directed graph approach:
1. Creates a map of departure locations to tickets
2. Identifies the starting point (location that's a departure but not a destination)
3. Follows the chain of tickets to create the sorted sequence
4. Validates that all tickets are used and no cycles exist

### Error Handling

- **Circular Routes**: Detects when tickets form a loop
- **Disconnected Routes**: Identifies when some tickets can't be reached
- **Invalid Data**: Validates ticket format and required fields
- **Missing Start Point**: Handles cases where no clear starting point exists

## Assumptions

1. **Single Journey**: Each set of tickets represents one continuous journey
2. **No Interruptions**: The itinerary has no gaps or interruptions
3. **Unique Locations**: Each location name is unique and exact matches are required
4. **In-Memory Storage**: Data is stored in memory (would use a database in production)
5. **Case Sensitivity**: Location names are case-sensitive
6. **No Time Constraints**: Tickets don't have time-based dependencies

## Adding New Transit Types

To add new transportation types:

1. **Update the TransitType enum** in `src/itinerary/dto/ticket.dto.ts`:
```typescript
export enum TransitType {
  // ... existing types
  SUBWAY = 'subway',
  FERRY = 'ferry',
}
```

2. **Add formatting logic** in `TicketSorterService.generateReadableItinerary()`:
```typescript
case 'subway':
  instruction += `Board the subway ${ticket.identifier || ''} from ${ticket.from} to ${ticket.to}`;
  break;
case 'ferry':
  instruction += `Board the ferry ${ticket.identifier || ''} from ${ticket.from} to ${ticket.to}`;
  break;
```

3. **Update tests** to cover the new transit types

### Extension Points for Different Characteristics

- **Time-based routing**: Add departure/arrival times to tickets
- **Multi-modal connections**: Handle transfers between different transport types
- **Capacity constraints**: Add passenger limits or booking requirements
- **Geographic routing**: Include distance or duration calculations
- **Cost optimization**: Add pricing information for route optimization

## Code Quality

One of my focuses was to make the code readable and maintainable. Some of the things I did:
- **Modular Design**: Clear separation of concerns
- **Type Safety**: Full TypeScript implementation
- **Validation**: Comprehensive input validation with class-validator
- **Error Handling**: Proper exception handling and user feedback
- **Documentation**: Swagger/OpenAPI documentation
- **Testing**: Unit and integration tests with good coverage
- **Linting**: ESLint configuration for code consistency

## Performance Considerations

- **Algorithm Complexity**: O(n) time complexity for sorting tickets
- **Memory Usage**: In-memory storage suitable for moderate workloads
- **Scalability**: Can be extended with database storage and caching

## Production Considerations

For production deployment, I would consider:
- Database integration (PostgreSQL, MongoDB)
- Authentication and authorization
- Rate limiting
- Caching layer (Redis)
- Logging and monitoring
- Container deployment (Docker)
- Load balancing and clustering