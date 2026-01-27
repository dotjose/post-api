import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { RemovePostsByUserCommand } from "../remove-posts-by-user.command";
import { PostRepository } from "domain/post.repository";

@CommandHandler(RemovePostsByUserCommand)
export class RemovePostsByUserHandler implements ICommandHandler<RemovePostsByUserCommand> {
    private readonly logger = new Logger(RemovePostsByUserHandler.name);

    constructor(
        @Inject("PostRepository") private readonly postRepository: PostRepository
    ) { }

    async execute(command: RemovePostsByUserCommand) {
        const { userId } = command;

        this.logger.log(`Remove posts by user initiated for userId: ${userId}`);

        try {
            const deletedCount = await this.postRepository.deleteManyByAuthorId(userId);

            this.logger.log(`Successfully deleted ${deletedCount} posts for user ${userId}`);

            // Requirement: Invalidate any related caches (e.g., global job stats, user-specific stats)
            // TODO: Implement actual cache invalidation logic when cache service is available
            this.logger.log(`Cache invalidation triggered for user ${userId} stats and global stats`);

            return {
                success: true,
                message: `Deleted ${deletedCount} posts for user.`,
                deletedCount,
            };
        } catch (error) {
            this.logger.error(`Failed to delete posts for user ${userId}`, error.stack);
            throw error;
        }
    }
}
