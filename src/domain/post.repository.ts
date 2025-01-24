import { Blog, Event, EventProps, PostProps } from "./post.entity";

export interface PostRepository {
  // Create a blog
  createBlog(post: Omit<PostProps, "type">): Promise<Blog>;

  // Create an event
  createEvent(post: Omit<EventProps, "type">): Promise<Event>;

  // Get all posts (both blogs and events)
  findAll(
    page: number,
    limit: number,
    sort?: Record<string, 1 | -1>
  ): Promise<(PostProps | EventProps)[]>;

  // Get all blogs (paginated, filterable, and sortable)
  findBlogs(
    page: number,
    limit: number,
    filters?: Partial<PostProps>,
    sort?: Record<string, 1 | -1>
  ): Promise<PostProps[]>;

  // Get all events (paginated, filterable, and sortable)
  findEvents(
    page: number,
    limit: number,
    filters?: Partial<EventProps>,
    sort?: Record<string, 1 | -1>
  ): Promise<EventProps[]>;

  // Get all events by creator Id (paginated, filterlable and sortable)
  findEventsByCreatorId(
    page: number,
    limit: number,
    creatorId: string,
    filters?: Partial<EventProps>,
    sort?: Record<string, 1 | -1>
  );

  // Get all blogs by creator Id (paginated, filterlable and sortable)
  findBlogsByCreatorId(
    page: number,
    limit: number,
    creatorId: string,
    filters?: Partial<EventProps>,
    sort?: Record<string, 1 | -1>
  );

  // Get all published blogs (paginated)
  findPublishedBlogs(page: number, limit: number): Promise<PostProps[]>;

  // Get all published events (paginated)
  findPublishedEvents(page: number, limit: number): Promise<EventProps[]>;

  // Get a post by ID
  findById(id: string): Promise<Blog | Event | null>;

  // Update a post
  update(
    id: string,
    updatedProps: Partial<PostProps | EventProps>
  ): Promise<Blog | Event | null>;

  // Delete a post
  delete(id: string): Promise<boolean>;
}
