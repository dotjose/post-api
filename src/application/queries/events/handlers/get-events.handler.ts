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
    const { page = 1, limit = 10, creatorId } = query;

    // Logging the received query parameters
    this.logger.log(
      `Executing GetPostsQuery with page: ${page}, limit: ${limit}`
    );

    // Fetching blogs with pagination
    const posts = await this.postRepository.findEventsByCreatorId(
      page,
      limit,
      creatorId
    );

    this.logger.log(
      `Fetched ${posts.items.length} of ${posts.total} blog(s) (page ${page}/${posts.totalPages})`
    );

    return posts;
  }
}
