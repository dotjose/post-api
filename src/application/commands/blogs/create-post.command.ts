export class CreatePostCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly tags: string[],
    public readonly featureImg?: string
  ) {}
}
