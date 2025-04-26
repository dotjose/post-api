import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Blog, Event, PostProps, EventProps } from "domain/post.entity";
import { PostRepository } from "domain/post.repository";
import { PostDocument } from "infrastructure/persistence/mongodb/schemas/post.schema";
import { PostMapper } from "infrastructure/mappers/post.mapper";
import { PaginatedResultDTO } from "presentation/dtos/common.dto";

@Injectable()
export class MongoPostRepository implements PostRepository {
  constructor(
    @InjectModel(PostDocument.name)
    private readonly postModel: Model<PostDocument>
  ) {}

  private async paginatedQuery<T>(
    query: any,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1>,
    mapper: (doc: any) => T
  ): Promise<PaginatedResultDTO<T>> {
    // Validate pagination parameters
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100)); // Enforce reasonable limits

    const [docs, total] = await Promise.all([
      this.postModel
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.postModel.countDocuments(query),
    ]);

    return {
      items: docs.map(mapper),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Create a blog
  async createBlog(props: Omit<PostProps, "type">): Promise<Blog> {
    const blog = await this.postModel.create({ ...props, type: "blog" });
    return PostMapper.toEntity(blog) as Blog;
  }

  // Create an event
  async createEvent(props: Omit<EventProps, "type">): Promise<Event> {
    const event = await this.postModel.create({ ...props, type: "event" });
    return PostMapper.toEntity(event) as Event;
  }

  // Get all posts (events, blogs)
  async findAll(
    page: number,
    limit: number,
    sort: Record<string, 1 | -1> = { updatedAt: -1 }
  ): Promise<PaginatedResultDTO<PostProps | EventProps>> {
    return this.paginatedQuery(
      { isPublished: true },
      page,
      limit,
      sort,
      (post) => {
        if (post.type === "event") {
          return new Event(post as EventProps).getProps();
        } else if (post.type === "blog") {
          return new Blog(post as PostProps).getProps();
        }
        throw new Error(`Unknown post type: ${post.type}`);
      }
    );
  }

  // Get all blogs only (paginated, filterable, and sortable)
  async findBlogs(
    page: number,
    limit: number,
    filters: Partial<PostProps> = {},
    sort: Record<string, 1 | -1> = { updatedAt: -1 }
  ): Promise<PaginatedResultDTO<PostProps>> {
    return this.paginatedQuery(
      { ...filters, type: "blog" },
      page,
      limit,
      sort,
      (blog) => new Blog(blog as PostProps).getProps()
    );
  }

  // Get all events only (paginated, filterable, and sortable)
  async findEvents(
    page: number,
    limit: number,
    filters: Partial<EventProps> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<PaginatedResultDTO<EventProps>> {
    return this.paginatedQuery(
      { ...filters, type: "event" },
      page,
      limit,
      sort,
      (event) => new Event(event as EventProps).getProps()
    );
  }

  // Get all published blogs (paginated)
  async findPublishedBlogs(
    page: number,
    limit: number
  ): Promise<PaginatedResultDTO<PostProps>> {
    return this.findBlogs(page, limit, { isPublished: true });
  }

  // Get all my events (paginated)
  async findEventsByCreatorId(
    page: number,
    limit: number,
    creatorId: string,
    filters?: Partial<EventProps>,
    sort?: Record<string, 1 | -1>
  ): Promise<PaginatedResultDTO<EventProps>> {
    return this.findEvents(
      page,
      limit,
      { ...filters, authorId: creatorId },
      sort
    );
  }

  // Get all my events (paginated)
  async findBlogsByCreatorId(
    page: number,
    limit: number,
    creatorId: string,
    filters?: Partial<PostProps>,
    sort?: Record<string, 1 | -1>
  ): Promise<PaginatedResultDTO<PostProps>> {
    return this.findBlogs(
      page,
      limit,
      { ...filters, authorId: creatorId },
      sort
    );
  }

  // Get all published events (paginated)
  async findPublishedEvents(
    page: number,
    limit: number
  ): Promise<PaginatedResultDTO<EventProps>> {
    return this.findEvents(page, limit, { isPublished: true });
  }

  // Get a post by ID
  async findById(id: string): Promise<Blog | Event | null> {
    if (!id) throw new Error("Invalid ID");

    const post = await this.postModel.findById(id);
    if (!post) return null;

    return PostMapper.toEntity(post as PostDocument);
  }

  // Update a post
  async update(
    id: string,
    updatedProps: Partial<PostProps | EventProps>
  ): Promise<Blog | Event | null> {
    if (!id) throw new Error("Invalid ID");

    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatedProps
    );
    if (!updatedPost) return null;

    return PostMapper.toEntity(updatedPost as PostDocument);
  }

  // Delete a post
  async delete(id: string): Promise<boolean> {
    if (!id) throw new Error("Invalid ID");

    const result = await this.postModel.findByIdAndDelete(id);
    return !!result;
  }
}
