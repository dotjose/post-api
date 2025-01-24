import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEventCommand } from "./create-event.command";
import { Inject, Logger } from "@nestjs/common";
import { PostRepository } from "domain/post.repository";
import { EventProps } from "domain/post.entity";

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  private readonly logger = new Logger(CreateEventHandler.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async execute(command: CreateEventCommand): Promise<EventProps> {
    // Log initiation of the post creation process
    this.logger.log("Create event initiated", {
      timestamp: new Date().toISOString(),
      commandData: command, // Log the command data for traceability
    });

    try {
      // Attempt to create the event post
      const post = await this.postRepository.createEvent(command);

      // Log success after event creation
      this.logger.log("Post successfully created", {
        timestamp: new Date().toISOString(),
        authorId: post.getProps().authorId, // Include event ID or author ID for traceability
        title: post.getProps().title,
      });

      // Return the post data after creation
      return post.getProps();
    } catch (error) {
      // Log the error and rethrow it
      this.logger.error("Failed to create event", error.stack, {
        timestamp: new Date().toISOString(),
        commandData: command, // Log the command data to see which data failed
      });

      // Optionally, rethrow the error to be handled higher up (e.g., in a global exception filter)
      throw error;
    }
  }
}
