import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";

@Injectable()
export class AIService {
  private openai: OpenAI;
  private pinecone: PineconeClient;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_API_KEY"),
    });
    //this.initPinecone();
  }

  // private async initPinecone() {
  //   this.pinecone = new PineconeClient();
  //   await this.pinecone.init({
  //     environment: this.configService.get<string>("PINECONE_ENVIRONMENT"),
  //     apiKey: this.configService.get<string>("PINECONE_API_KEY"),
  //   });
  // }

  async generateBlogIdeas(topic: string, count: number = 5): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a creative blog content strategist. Generate unique and engaging blog post ideas.",
        },
        {
          role: "user",
          content: `Generate ${count} blog post ideas about ${topic}. Make them engaging and SEO-friendly.`,
        },
      ],
      temperature: 0.8,
    });

    return response.choices[0].message.content
      .split("\n")
      .filter((idea) => idea.trim());
  }

  async generateBlogOutline(title: string): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert blog post outliner. Create detailed, well-structured outlines.",
        },
        {
          role: "user",
          content: `Create a detailed outline for a blog post titled: "${title}"`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content
      .split("\n")
      .filter((line) => line.trim());
  }

  async generateDraftContent(outline: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert blog writer. Create engaging, well-researched content.",
        },
        {
          role: "user",
          content: `Write a detailed blog post based on this outline: ${outline}`,
        },
      ],
      temperature: 0.6,
    });

    return response.choices[0].message.content;
  }

  async improveContent(content: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert editor. Improve the content while maintaining its core message.",
        },
        {
          role: "user",
          content: `Improve this content by making it more engaging and SEO-friendly: ${content}`,
        },
      ],
      temperature: 0.4,
    });

    return response.choices[0].message.content;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  }

  async semanticSearch(query: string, limit: number = 10): Promise<any[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    const index = this.pinecone.Index("blog-posts");

    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
    } as any);

    return searchResponse.matches;
  }

  async suggestTags(content: string): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a content categorization expert. Suggest relevant tags for blog content.",
        },
        {
          role: "user",
          content: `Suggest relevant tags for this content (respond with comma-separated tags only): ${content}`,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content
      .split(",")
      .map((tag) => tag.trim());
  }
}
