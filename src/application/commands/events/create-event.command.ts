import { LocationDto } from "presentation/dtos/common.dto";

export class CreateEventCommand {
  constructor(
    public readonly title: string,
    public readonly subTitle: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly tags: string[],
    public readonly eventStart: Date,
    public readonly eventEnd: Date,
    public location: LocationDto,
    public readonly featureImg?: string[]
  ) {}
}
