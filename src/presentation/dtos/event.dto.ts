import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsArray,
  IsNotEmpty,
  IsUrl,
  ValidateNested,
  IsBoolean,
  IsDateString,
} from "class-validator";
import { LocationDto } from "./common.dto";

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  tags: string[];

  @ApiProperty()
  @IsDateString()
  eventStart: Date;

  @ApiProperty()
  @IsDateString()
  eventEnd: Date;

  @ApiProperty({
    type: LocationDto,
    example: { longitude: 12.34, latitude: 56.78, address: "123 Main St" },
  })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location: LocationDto;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  featureImg?: string;
}

export class UpdateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  tags: string[];

  @ApiProperty()
  @IsDateString()
  eventStart: Date;

  @ApiProperty()
  @IsDateString()
  eventEnd: Date;

  @ApiProperty({
    type: LocationDto,
    example: { longitude: 12.34, latitude: 56.78, address: "123 Main St" },
  })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location: LocationDto;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  featureImg?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
