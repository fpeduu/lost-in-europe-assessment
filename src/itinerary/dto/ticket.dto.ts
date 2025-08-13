import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TransitType {
  TRAIN = 'train',
  AIRPLANE = 'airplane',
  BUS = 'bus',
  BOAT = 'boat',
  TAXI = 'taxi',
  TRAM = 'tram',
}

export class TicketDto {
  @ApiProperty({
    description: 'Type of transportation',
    enum: TransitType,
    example: 'train',
  })
  @IsEnum(TransitType)
  @IsNotEmpty()
  type: TransitType;

  @ApiProperty({
    description: 'Starting location',
    example: 'St. Anton am Arlberg Bahnhof',
  })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({
    description: 'Destination location',
    example: 'Innsbruck Hbf',
  })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description:
      'Transportation identifier (flight number, train number, etc.)',
    example: 'RJX 765',
    required: false,
  })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiProperty({
    description: 'Additional details like seat number, platform, gate, etc.',
    example: 'Platform 3, Seat number 17C',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;
}
