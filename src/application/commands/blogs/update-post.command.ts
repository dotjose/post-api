export class UpdatePostCommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly subTitle: string,
    public readonly content: string,
    public readonly tags: string[],
    public readonly featureImg?: string[],
    public readonly isPublished?: boolean
  ) {}
}
