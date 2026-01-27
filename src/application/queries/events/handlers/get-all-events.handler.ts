import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { GetAllEventsQuery } from "../get-all-events.query";
import { PostRepository } from "domain/post.repository";
import { PaginatedResultDTO } from "presentation/dtos/common.dto";
import { EventProps } from "domain/post.entity";

@QueryHandler(GetAllEventsQuery)
export class GetAllEventsHandler implements IQueryHandler<GetAllEventsQuery> {
    private readonly logger = new Logger(GetAllEventsHandler.name);

    constructor(
        @Inject("PostRepository") private readonly postRepository: PostRepository
    ) { }

    async execute(query: GetAllEventsQuery): Promise<PaginatedResultDTO<EventProps>> {
        const { page, limit, search, sort } = query;

        this.logger.log(
            `Executing GetAllEventsQuery with page: ${page}, limit: ${limit}, search: ${search}, sort: ${sort}`
        );

        const sortOption: Record<string, 1 | -1> = this.parseSort(sort);

        const result = await this.postRepository.findEvents(page, limit, search, {}, sortOption);

        this.logger.log(
            `Fetched ${result.items.length} of ${result.total} events`
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
