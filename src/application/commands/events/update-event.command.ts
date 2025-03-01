import { LocationDto } from "presentation/dtos/common.dto";

export class UpdateEventCommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly tags: string[],
    public readonly eventStart: Date,
    public readonly eventEnd: Date,
    public location: LocationDto,
    public readonly featureImg?: string[],
    public readonly isPublished?: boolean
  ) {}
}
