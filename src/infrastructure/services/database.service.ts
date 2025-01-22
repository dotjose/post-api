import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostDocument } from "infrastructure/persistence/mongodb/schemas/post.schema";
import { Model } from "mongoose";

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(PostDocument.name)
    private readonly postModel: Model<PostDocument>
  ) {}

  async syncIndexes() {
    // Sync indexes for each model
    await this.postModel.syncIndexes();
  }
}
