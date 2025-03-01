import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
} from "class-validator";

export interface PaginatedResultDTO<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class LocationDto {
  @ApiPropertyOptional({ example: "Point" })
  @IsOptional()
  @IsString()
  @IsEnum(["Point"]) // Enforce GeoJSON type
  type: "Point";

  @ApiPropertyOptional({ example: [12.34, 56.78] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number]; // [longitude, latitude]

  @ApiPropertyOptional({ example: "123 Main St" })
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;
}
