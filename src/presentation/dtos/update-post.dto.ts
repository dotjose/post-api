import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  featureImg?: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
