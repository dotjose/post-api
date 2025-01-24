import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostCommand } from "../create-post.command";
import { Inject, Logger } from "@nestjs/common";
import { PostRepository } from "domain/post.repository";
import { PostProps } from "domain/post.entity";

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  private readonly logger = new Logger(CreatePostHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(command: CreatePostCommand): Promise<PostProps> {
    // Log initiation of the post creation process
    this.logger.log("Create post initiated", {
      timestamp: new Date().toISOString(),
      commandData: command, // Log the command data for traceability
    });

    try {
      // Attempt to create the blog post
      const post = await this.postRepository.createBlog(command);

      // Log success after post creation
      this.logger.log("Post successfully created", {
        timestamp: new Date().toISOString(),
        authorId: post.getProps().authorId, // Include post ID or author ID for traceability
        title: post.getProps().title,
      });

      // Return the post data after creation
      return post.getProps();
    } catch (error) {
      // Log the error and rethrow it
      this.logger.error("Failed to create post", error.stack, {
        timestamp: new Date().toISOString(),
        commandData: command, // Log the command data to see which data failed
      });

      // Optionally, rethrow the error to be handled higher up (e.g., in a global exception filter)
      throw error;
    }
  }
}
