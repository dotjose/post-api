import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUrl,
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
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  featureImg?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
