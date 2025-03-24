import { IsString, IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  featureImg?: string[];
}
