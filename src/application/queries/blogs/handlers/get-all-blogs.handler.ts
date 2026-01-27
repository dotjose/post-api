import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { GetAllBlogsQuery } from "../get-all-blogs.query";
import { PostRepository } from "domain/post.repository";
import { PaginatedResultDTO } from "presentation/dtos/common.dto";
import { PostProps } from "domain/post.entity";

@QueryHandler(GetAllBlogsQuery)
export class GetAllBlogsHandler implements IQueryHandler<GetAllBlogsQuery> {
    private readonly logger = new Logger(GetAllBlogsHandler.name);

    constructor(
        @Inject("PostRepository") private readonly postRepository: PostRepository
    ) { }

    async execute(query: GetAllBlogsQuery): Promise<PaginatedResultDTO<PostProps>> {
        const { page, limit, search, sort } = query;

        this.logger.log(
            `Executing GetAllBlogsQuery with page: ${page}, limit: ${limit}, search: ${search}, sort: ${sort}`
        );

        const sortOption: Record<string, 1 | -1> = this.parseSort(sort);

        const result = await this.postRepository.findBlogs(page, limit, search, {}, sortOption);

        this.logger.log(
            `Fetched ${result.items.length} of ${result.total} blogs`
        );

        return result;
    }

    private parseSort(sort?: string): Record<string, 1 | -1> {
        if (!sort) return { updatedAt: -1 };
        if (sort.startsWith("-")) {
            return { [sort.substring(1)]: -1 };
        }
        const [field, order] = sort.split(":");
        if (order && order.toLowerCase() === "desc") {
            return { [field]: -1 };
        }
        return { [field]: 1 };
    }
}
