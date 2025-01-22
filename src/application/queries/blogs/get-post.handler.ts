import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, Logger, NotFoundException } from "@nestjs/common";
import { PostRepository } from "domain/post.repository";
import { EventProps, PostProps } from "domain/post.entity";
import { GetPostQuery } from "./get-post.query";

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  private readonly logger = new Logger(GetPostHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(query: GetPostQuery): Promise<PostProps | EventProps | null> {
    this.logger.log(`Received GetPostQuery for ID: ${query.id}`);

    // Fetch the post from the repository
    const post = await this.postRepository.findById(query.id);

    if (!post) {
      this.logger.warn(`No post found with ID: ${query.id}`);
      throw new NotFoundException(`Post with ID ${query.id} not found`);
    }

    this.logger.log(`Successfully fetched post with ID: ${query.id}`, {
      title: post.getProps().title,
      type: post.getProps().type,
    });

    return post.getProps();
  }
}
