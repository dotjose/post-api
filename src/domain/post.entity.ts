import { AggregateRoot } from "@nestjs/cqrs";

// Shared properties for all posts
export interface PostProps {
  title: string;
  content: string;
  authorId: string;
  type: "blog" | "event";
  featureImg?: string;
  tags?: string[];
  isPublished?: boolean;
}

// Blog-specific entity
export class Blog extends AggregateRoot {
  private props: PostProps;

  constructor(props: Omit<PostProps, "type">) {
    super();
    this.props = {
      ...props,
      type: "blog",
      isPublished: props.isPublished ?? false,
    };
  }

  getProps(): PostProps {
    return this.props;
  }

  updateBlog(updatedProps: Partial<PostProps>): void {
    this.props = { ...this.props, ...updatedProps };
  }
}

// Event-specific entity
export interface EventProps extends PostProps {
  eventStart: Date;
  eventEnd: Date;
  location: {
    type?: "Point";
    coordinates?: [number, number];
    address?: string;
  };
}

export class Event extends AggregateRoot {
  private props: EventProps;

  constructor(props: Omit<EventProps, "type">) {
    super();
    this.props = {
      ...props,
      type: "event", // Ensure 'type' is always set to 'event'
      isPublished: props.isPublished ?? false, // Default to false if not provided
    };
  }

  getProps(): EventProps {
    return this.props;
  }

  updateEvent(updatedProps: Partial<EventProps>): void {
    this.props = { ...this.props, ...updatedProps };
  }
}
