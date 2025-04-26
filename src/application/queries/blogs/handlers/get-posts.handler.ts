import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { GetPostsQuery } from "../get-posts.query";
import { PostRepository } from "domain/post.repository";
import { PaginatedResultDTO } from "presentation/dtos/common.dto";
import { PostProps } from "domain/post.entity";

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  private readonly logger = new Logger(GetPostsHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(query: GetPostsQuery): Promise<PaginatedResultDTO<PostProps>> {
    const { page = 1, limit = 10, creatorId } = query;

    this.logger.log(
      `Executing GetPostsQuery with page: ${page}, limit: ${limit}`
    );

    const result = await this.postRepository.findBlogsByCreatorId(
      page,
      limit,
      creatorId
    );

    this.logger.log(
      `Fetched ${result.items.length} of ${result.total} blog(s) (page ${page}/${result.totalPages})`
    );

    return result;
  }
}
