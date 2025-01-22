import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AIService } from "infrastructure/services/openai.service";
import {
  GenerateIdeasDto,
  GenerateOutlineDto,
  GenerateContentDto,
  ImproveContentDto,
  SemanticSearchDto,
} from "./dtos/ai-request.dto";

@ApiTags("ai")
@Controller("ai")
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post("generate-ideas")
  @ApiOperation({ summary: "Generate blog post ideas based on a topic" })
  async generateIdeas(@Body() dto: GenerateIdeasDto) {
    return await this.aiService.generateBlogIdeas(dto.topic, dto.count);
  }

  @Post("generate-outline")
  @ApiOperation({ summary: "Generate a blog post outline" })
  async generateOutline(@Body() dto: GenerateOutlineDto) {
    return await this.aiService.generateBlogOutline(dto.title);
  }

  @Post("generate-content")
  @ApiOperation({ summary: "Generate blog post content from an outline" })
  async generateContent(@Body() dto: GenerateContentDto) {
    return await this.aiService.generateDraftContent(dto.outline);
  }

  @Post("improve-content")
  @ApiOperation({ summary: "Improve existing blog content" })
  async improveContent(@Body() dto: ImproveContentDto) {
    return await this.aiService.improveContent(dto.content);
  }

  @Get("semantic-search")
  @ApiOperation({ summary: "Perform semantic search across blog posts" })
  async semanticSearch(@Query() dto: SemanticSearchDto) {
    return await this.aiService.semanticSearch(dto.query, dto.limit);
  }

  @Post("suggest-tags")
  @ApiOperation({ summary: "Suggest tags for blog content" })
  async suggestTags(@Body() dto: ImproveContentDto) {
    return await this.aiService.suggestTags(dto.content);
  }
}
