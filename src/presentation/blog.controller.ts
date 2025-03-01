import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { CreatePostCommand } from "application/commands/blogs/create-post.command";
import { UpdatePostCommand } from "application/commands/blogs/update-post.command";
import { DeletePostCommand } from "application/commands/blogs/delete-post.command";
import { GetPostsQuery } from "application/queries/blogs/get-posts.query";
import { GetPostQuery } from "application/queries/blogs/get-post.query";
import { EventProps, PostProps } from "domain/post.entity";
import { GetPublishedPostsQuery } from "application/queries/blogs/get-published-posts.query";
import { CreateEventDto, UpdateEventDto } from "./dtos/event.dto";
import { CreateEventCommand } from "application/commands/events/create-event.command";
import { UpdateEventCommand } from "application/commands/events/update-event.command";
import { GetEventsQuery } from "application/queries/events/get-events.query";
import { GetPublishedEventsQuery } from "application/queries/events/get-published-events.query";

@ApiTags("posts")
@Controller("posts")
export class BlogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post("/blogs")
  @ApiOperation({ summary: "Create a new blog post" })
  async createBlog(@Body() createPostDto: CreatePostDto): Promise<PostProps> {
    const command = new CreatePostCommand(
      createPostDto.title,
      createPostDto.subTitle,
      createPostDto.content,
      createPostDto.authorId,
      createPostDto.tags,
      createPostDto.featureImg
    );
    return await this.commandBus.execute(command);
  }

  @Post("/events")
  @ApiOperation({ summary: "Create a new event post" })
  async createEvent(
    @Body() createEventDto: CreateEventDto
  ): Promise<EventProps> {
    const command = new CreateEventCommand(
      createEventDto.title,
      createEventDto.subTitle,
      createEventDto.content,
      createEventDto.authorId,
      createEventDto.tags,
      createEventDto.eventStart,
      createEventDto.eventEnd,
      createEventDto.location,
      createEventDto.featureImg
    );
    return await this.commandBus.execute(command);
  }

  @Patch("/blogs/:id")
  @ApiOperation({ summary: "Update an existing blog content" })
  async updateBlog(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostProps> {
    const command = new UpdatePostCommand(
      id,
      updatePostDto.title,
      updatePostDto.subTitle,
      updatePostDto.content,
      updatePostDto.tags,
      updatePostDto.featureImg,
      updatePostDto.isPublished
    );
    return await this.commandBus.execute(command);
  }

  @Patch("/events/:id")
  @ApiOperation({ summary: "Update an existing event content" })
  async updateEvent(
    @Param("id") id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<EventProps> {
    const command = new UpdateEventCommand(
      id,
      updateEventDto.title,
      updateEventDto.content,
      updateEventDto.tags,
      updateEventDto.eventStart,
      updateEventDto.eventEnd,
      updateEventDto.location,
      updateEventDto.featureImg,
      updateEventDto.isPublished
    );
    return await this.commandBus.execute(command);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a post (blog, event)" })
  async deletePost(@Param("id") id: string) {
    const command = new DeletePostCommand(id);
    return await this.commandBus.execute(command);
  }

  @Get("/blogs/draft")
  @ApiOperation({ summary: "Get all blog posts with pagination and search" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "tags", required: false, type: [String] })
  async getBlogs(
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 25,
    @Query("creatorId") creatorId: string,
    @Query("search") search?: string,
    @Query("tags") tags?: string[]
  ): Promise<PostProps[]> {
    const query = new GetPostsQuery(page, limit, creatorId, search, tags);
    return await this.queryBus.execute(query);
  }

  @Get("blogs")
  @ApiOperation({ summary: "Get all blog posts with pagination and search" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "tags", required: false, type: [String] })
  async getPublishedBlogs(
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 25,
    @Query("search") search?: string,
    @Query("tags") tags?: string[]
  ): Promise<PostProps[]> {
    const query = new GetPublishedPostsQuery(page, limit, search, tags);
    return await this.queryBus.execute(query);
  }

  @Get("/events/draft")
  @ApiOperation({ summary: "Get all blog posts with pagination and search" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "tags", required: false, type: [String] })
  async getEvents(
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 25,
    @Query("creatorId") creatorId: string,
    @Query("search") search?: string,
    @Query("tags") tags?: string[]
  ): Promise<EventProps[]> {
    const query = new GetEventsQuery(page, limit, creatorId, search, tags);
    return await this.queryBus.execute(query);
  }

  @Get("events")
  @ApiOperation({ summary: "Get all blog posts with pagination and search" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "tags", required: false, type: [String] })
  async getPublishedEvents(
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 25,
    @Query("search") search?: string,
    @Query("tags") tags?: string[]
  ): Promise<EventProps[]> {
    const query = new GetPublishedEventsQuery(page, limit, search, tags);
    return await this.queryBus.execute(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get post (event, blog) detail by id" })
  async getPost(@Param("id") id: string): Promise<EventProps | PostProps> {
    const query = new GetPostQuery(id);
    return await this.queryBus.execute(query);
  }
}
