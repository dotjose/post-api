import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePostCommand } from "../update-post.command";
import { UpdateEntityService } from "application/services/update-entity.service";
import { PostProps } from "domain/post.entity";

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly updateEntityService: UpdateEntityService) {}

  async execute(command: UpdatePostCommand) {
    return this.updateEntityService.updateEntity<PostProps>(
      command.id,
      command,
      "Blog"
    );
  }
}
