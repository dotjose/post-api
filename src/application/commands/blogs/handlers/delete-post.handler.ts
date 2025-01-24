import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { DeletePostCommand } from "../delete-post.command";
import { PostRepository } from "domain/post.repository";

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  private readonly logger = new Logger(DeletePostHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(command: DeletePostCommand) {
    // Log initiation of the post deletion process
    this.logger.log("Delete post initiated", {
      timestamp: new Date().toISOString(),
      postId: command.id, // Log the post id for traceability
    });

    try {
      // Attempt to delete the post
      const result = await this.postRepository.delete(command.id);

      if (!result) {
        // If no post was deleted, log this and throw an error or handle appropriately
        this.logger.warn(`Post with ID ${command.id} not found for deletion.`, {
          timestamp: new Date().toISOString(),
        });
        throw new Error(`Post with ID ${command.id} not found`);
      }

      // Log success after deletion
      this.logger.log(
        `Post with ID ${command.id} has been successfully deleted.`,
        {
          timestamp: new Date().toISOString(),
        }
      );

      // Optionally, return some confirmation object if needed
      return { success: true, message: `Post with ID ${command.id} deleted.` };
    } catch (error) {
      // Log error and rethrow if necessary
      this.logger.error(
        `Failed to delete post with ID ${command.id}`,
        error.stack,
        {
          timestamp: new Date().toISOString(),
          postId: command.id,
        }
      );

      // Rethrow error to be handled higher up if needed
      throw error;
    }
  }
}
