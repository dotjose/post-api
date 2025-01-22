import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateIdeasDto {
  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty({ required: false, default: 5 })
  @IsNumber()
  @IsOptional()
  count?: number;
}

export class GenerateOutlineDto {
  @ApiProperty()
  @IsString()
  title: string;
}

export class GenerateContentDto {
  @ApiProperty()
  @IsString()
  outline: string;
}

export class ImproveContentDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class SemanticSearchDto {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  limit?: number;
}