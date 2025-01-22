import { Injectable, NotFoundException, Logger, Inject } from "@nestjs/common";
import { PostRepository } from "domain/post.repository";
import { PostProps, EventProps } from "domain/post.entity";

@Injectable()
export class UpdateEntityService {
  private readonly logger = new Logger(UpdateEntityService.name);

  constructor(
    @Inject("PostRepository") private readonly postRepository: PostRepository
  ) {}

  async updateEntity<T>(
    id: string,
    updateData: any,
    entityType: string
  ): Promise<EventProps | PostProps> {
    this.logger.log(`Initiating update for ${entityType} with ID: ${id}`);

    try {
      const updatedEntity = await this.postRepository.update(id, updateData);

      if (!updatedEntity) {
        this.logger.warn(`${entityType} with ID ${id} not found.`);
        throw new NotFoundException(`${entityType} with ID ${id} not found`);
      }

      this.logger.log(`Successfully updated ${entityType} with ID: ${id}`);
      return updatedEntity.getProps();
    } catch (error) {
      this.logger.error(
        `Failed to update ${entityType} with ID: ${id}`,
        error.stack
      );
      throw error;
    }
  }
}
