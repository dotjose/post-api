import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { GetEventsQuery } from "../get-events.query";
import { PostRepository } from "domain/post.repository";
import { EventProps } from "domain/post.entity";
import { PaginatedResultDTO } from "presentation/dtos/common.dto";

@QueryHandler(GetEventsQuery)
export class GetEventsHandler implements IQueryHandler<GetEventsQuery> {
  private readonly logger = new Logger(GetEventsHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(
    query: GetEventsQuery
  ): Promise<PaginatedResultDTO<EventProps>> {
    const { page = 1, limit = 10 } = query;

    // Logging the received query parameters
    this.logger.log(
      `Executing GetPostsQuery with page: ${page}, limit: ${limit}`
    );

    // Fetching blogs with pagination
    const posts = await this.postRepository.findEvents(page, limit);

    // Log the number of fetched posts
    this.logger.log(`Fetched ${posts.length} blog(s) for page ${page}`);

    // Paginate the results
    this.logger.log(`Paginating results...`);
    const paginatedResults = this.paginateResults(posts, page, limit);
    this.logger.log(`Returning page ${page} of blogs`);

    return paginatedResults;
  }

  private paginateResults(posts: EventProps[], page: number, limit: number) {
    const totalPages = Math.ceil(posts.length / limit);
    this.logger.debug(`Total pages: ${totalPages}`);
    return {
      items: posts.slice((page - 1) * limit, page * limit),
      total: posts.length,
      page,
      limit,
      totalPages,
    };
  }
}
