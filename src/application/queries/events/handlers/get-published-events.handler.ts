import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { PostRepository } from "domain/post.repository";
import { EventProps } from "domain/post.entity";
import { PaginatedResultDTO } from "presentation/dtos/common.dto";
import { GetPublishedEventsQuery } from "../get-published-events.query";

@QueryHandler(GetPublishedEventsQuery)
export class GetPublishedEventsHandler
  implements IQueryHandler<GetPublishedEventsQuery>
{
  private readonly logger = new Logger(GetPublishedEventsHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(
    query: GetPublishedEventsQuery
  ): Promise<PaginatedResultDTO<EventProps>> {
    const { page = 1, limit = 10 } = query;

    // Logging the received query parameters
    this.logger.log(
      `Executing GetPostsQuery with page: ${page}, limit: ${limit}`
    );

    // Fetching blogs with pagination
    const posts = await this.postRepository.findPublishedEvents(page, limit);

    this.logger.log(
      `Fetched ${posts.items.length} of ${posts.total} blog(s) (page ${page}/${posts.totalPages})`
    );

    return posts;
  }
}
