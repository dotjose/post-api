import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Blog, Event, PostProps, EventProps } from "domain/post.entity";
import { PostRepository } from "domain/post.repository";
import { PostDocument } from "infrastructure/persistence/mongodb/schemas/post.schema";
import { PostMapper } from "infrastructure/mappers/post.mapper";

@Injectable()
export class MongoPostRepository implements PostRepository {
  constructor(
    @InjectModel(PostDocument.name)
    private readonly postModel: Model<PostDocument>
  ) {}

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

  // Get all posts
  async findAll(): Promise<(Blog | Event)[]> {
    const posts = await this.postModel.find().lean();
    return PostMapper.toEntities(posts as PostDocument[]);
  }

  // Get all blogs only (paginated, filterable, and sortable)
  async findBlogs(
    page: number,
    limit: number,
    filters: Partial<PostProps> = {},
    sort: Record<string, 1 | -1> = { updatedAt: -1 }
  ): Promise<PostProps[]> {
    const query = { ...filters, type: "blog" };
    const blogs = await this.postModel
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return blogs.map((blog) => new Blog(blog as PostProps).getProps());
  }

  // Get all events only (paginated, filterable, and sortable)
  async findEvents(
    page: number,
    limit: number,
    filters: Partial<EventProps> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<EventProps[]> {
    const query = { ...filters, type: "event" };
    const events = await this.postModel
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return events.map((event) => new Event(event as any).getProps());
  }

  // Get all published blogs (paginated)
  async findPublishedBlogs(page: number, limit: number): Promise<PostProps[]> {
    return this.findBlogs(page, limit, { isPublished: true });
  }

  // Get all published events (paginated)
  async findPublishedEvents(
    page: number,
    limit: number
  ): Promise<EventProps[]> {
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
    console.log(updatedProps);
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
