export class GetAllBlogsQuery {
    constructor(
        public readonly page: number = 1,
        public readonly limit: number = 25,
        public readonly search?: string,
        public readonly sort?: string
    ) { }
}
