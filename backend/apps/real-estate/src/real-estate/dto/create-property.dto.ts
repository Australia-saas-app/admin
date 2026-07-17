import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  IsArray,
  Min,
  Max,
  Length,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Property type',
    example: 'Houses',
    enum: [
      'Houses',
      'Flats',
      'Apartments',
      'Townhouses',
      'Villas',
      'Condominiums',
      'Office Buildings',
      'Stores',
      'Shopping Malls',
      'Hotel',
      'Resorts',
      'Distribution Centers',
      'Industrial Sites',
      'Multi-Family Units',
      'Parking Sites',
      'Factories',
      'Warehouses',
      'Logistics Sites',
      'Units',
      'Cold Storage',
      'Recycling Centers',
      'Data Centers',
      'Aircraft Hangars',
      'Laboratories',
      'Transportation',
      'Fuel Stations',
      'Raw Land',
      'Development Land',
      'Agricultural Land',
      'Future Development Land',
      'Land Plots',
      'Riverside Land',
      'Seaside Land',
      'Supervised Land',
      'Other',
    ],
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  propertyType: string;

  @ApiProperty({
    description: 'Property status',
    example: 'Rent',
    enum: ['Rent', 'Buy', 'Sale', 'Mortgage'],
  })
  @IsString()
  @IsNotEmpty()
  propertyStatus: string;

  @ApiPropertyOptional({
    description: 'Current status',
    example: 'Vacant',
    enum: ['Vacant', 'Currently Rented', 'Under Construction', 'Ready-to-Move'],
  })
  @IsString()
  @IsOptional()
  currentStatus?: string;

  @ApiPropertyOptional({
    description: 'Property photos (multiple)',
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  photos?: string[];

  @ApiProperty({ description: 'Property description', example: 'Beautiful property description' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  description: string;

  @ApiPropertyOptional({ description: 'Size in square feet', example: 1500 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  sizeSquareFeet?: number;

  @ApiPropertyOptional({ description: 'Price/Budget', example: 500000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Property features',
    example: ['Air conditioning', 'Parking', 'Gym'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  features?: string[];

  // Residential Properties Fields
  @ApiPropertyOptional({ description: 'Number of beds (for residential properties)', example: 3 })
  @IsInt()
  @IsOptional()
  @Min(0)
  beds?: number;

  @ApiPropertyOptional({ description: 'Number of bathrooms (for residential properties)', example: 2 })
  @IsInt()
  @IsOptional()
  @Min(0)
  bathroom?: number;

  @ApiPropertyOptional({ description: 'Number of kitchens (for residential properties)', example: 1 })
  @IsInt()
  @IsOptional()
  @Min(0)
  kitchen?: number;

  @ApiProperty({ description: 'Category name (will be created if not exists)', example: 'Residential' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  category: string;

  @ApiPropertyOptional({ description: 'Display order', example: 1, default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Visibility status', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}


