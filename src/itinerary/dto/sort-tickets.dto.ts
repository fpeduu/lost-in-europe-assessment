import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { TicketDto } from './ticket.dto';

export class SortTicketsDto {
  @ApiProperty({
    description: 'Array of unsorted tickets',
    type: [TicketDto],
    example: [
      {
        type: 'train',
        from: 'St. Anton am Arlberg Bahnhof',
        to: 'Innsbruck Hbf',
        identifier: 'RJX 765',
        details: 'Platform 3, Seat number 17C',
      },
      {
        type: 'tram',
        from: 'Innsbruck Hbf',
        to: 'Innsbruck Airport',
        identifier: 'S5',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
