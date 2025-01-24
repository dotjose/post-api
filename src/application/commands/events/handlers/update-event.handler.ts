import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEventCommand } from "../update-event.command";
import { UpdateEntityService } from "application/services/update-entity.service";
import { EventProps } from "domain/post.entity";

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand> {
  constructor(private readonly updateEntityService: UpdateEntityService) {}

  async execute(command: UpdateEventCommand) {
    return this.updateEntityService.updateEntity<EventProps>(
      command.id,
      command,
      "Event"
    );
  }
}
