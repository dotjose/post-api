import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsUrl,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
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
  @IsOptional()
  @IsUrl()
  featureImg?: string;
}
