import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { PostRepository } from "domain/post.repository";
import { EventProps, PostProps } from "domain/post.entity";
import { PaginatedResultDTO } from "presentation/dtos/common.dto";
import { GetPublishedPostsQuery } from "../get-published-posts.query";

@QueryHandler(GetPublishedPostsQuery)
export class GetPublishedPostsHandler
  implements IQueryHandler<GetPublishedPostsQuery>
{
  private readonly logger = new Logger(GetPublishedPostsHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(
    query: GetPublishedPostsQuery
  ): Promise<PaginatedResultDTO<PostProps | EventProps>> {
    const { page = 1, limit = 10 } = query;

    // Logging the received query parameters
    this.logger.log(
      `Executing GetPostsQuery with page: ${page}, limit: ${limit}`
    );

    // Fetching blogs with pagination
    const posts = await this.postRepository.findAll(page, limit);

    this.logger.log(
      `Fetched ${posts.items.length} of ${posts.total} blog(s) (page ${page}/${posts.totalPages})`
    );

    return posts;
  }
}
