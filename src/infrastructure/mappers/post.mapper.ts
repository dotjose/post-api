import { Blog, Event, EventProps, PostProps } from "domain/post.entity";
import { PostDocument } from "infrastructure/persistence/mongodb/schemas/post.schema";

export class PostMapper {
  // Map a PostDocument to a PostProps
  static toPostProps(postDocument: PostDocument): PostProps | EventProps {
    const { _id, ...rest } = postDocument.toObject();
    return {
      ...rest,
      id: _id.toString(), // Map _id to id
    };
  }

  // Map a PostDocument to a Blog or Event entity
  static toEntity(postDocument: PostDocument): Blog | Event {
    const postProps = this.toPostProps(postDocument);
    return postProps.type === "event"
      ? new Event(postProps as EventProps)
      : new Blog(postProps as PostProps);
  }

  // Map an array of PostDocuments to Blog or Event entities
  static toEntities(postDocuments: PostDocument[]): (Blog | Event)[] {
    return postDocuments.map((post) => this.toEntity(post));
  }
}
