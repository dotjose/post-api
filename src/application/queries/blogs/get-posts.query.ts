export class GetPostsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly creatorId: string,
    public readonly search?: string,
    public readonly tags?: string[]
  ) {}
}
