import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";

// Command Handlers
import { CreatePostHandler } from "./application/commands/blogs/handlers/create-post.handler";
import { UpdatePostHandler } from "application/commands/blogs/handlers/update-post.handler";
import { DeletePostHandler } from "application/commands/blogs/handlers/delete-post.handler";
import { CreateEventHandler } from "application/commands/events/handlers/create-event.handler";

// Query Handlers
import { GetPostsHandler } from "./application/queries/blogs/handlers/get-posts.handler";
import { GetPostHandler } from "application/queries/blogs/handlers/get-post.handler";
import { GetPublishedPostsHandler } from "application/queries/blogs/handlers/get-published-posts.handler";
import { GetEventsHandler } from "application/queries/events/handlers/get-events.handler";
import { GetPublishedEventsHandler } from "application/queries/events/handlers/get-published-events.handler";
import { UpdateEventHandler } from "application/commands/events/handlers/update-event.handler";

// Services
import { AIService } from "infrastructure/services/openai.service";
import { CloudWatchService } from "infrastructure/services/cloudwatch.service";
import { MetricsService } from "infrastructure/monitoring/metrics.service";
import { PrometheusService } from "infrastructure/monitoring/prometheus.service";
import { DatabaseService } from "infrastructure/services/database.service";
import { UpdateEntityService } from "application/services/update-entity.service";

// Controllers
import { BlogController } from "./presentation/blog.controller";
import { AIController } from "./presentation/ai.controller";
import { PrometheusController } from "infrastructure/monitoring/prometheus.controller";
import { HealthController } from "infrastructure/health/health.controller";

//Repositories
import { MongoPostRepository } from "./infrastructure/repositories/mongodb/post.repository";

// Interceptors
import { LoggingInterceptor } from "./infrastructure/monitoring/logging.interceptor";
import { MetricsInterceptor } from "./infrastructure/interceptors/metrics.interceptor";

// Filters
import { SentryExceptionFilter } from "infrastructure/filters/http-exception.filter";

// Schemas
import {
  PostDocument,
  PostSchema,
} from "infrastructure/persistence/mongodb/schemas/post.schema";

const commandHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  CreateEventHandler,
  UpdateEventHandler,
];
const queryHandlers = [
  GetPostsHandler,
  GetPostHandler,
  GetPublishedPostsHandler,
  GetEventsHandler,
  GetPublishedEventsHandler,
];
const controllers = [
  BlogController,
  AIController,
  PrometheusController,
  HealthController,
];
const services = [
  AIService,
  CloudWatchService,
  MetricsService,
  PrometheusService,
  DatabaseService,
  UpdateEntityService,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration globally available
      cache: true, // Cache environment variables
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      // MongoDB connection options for better reliability
      retryWrites: true,
      w: "majority",
      retryAttempts: 5,
      retryDelay: 1000,
    }),
    MongooseModule.forFeature([
      { name: PostDocument.name, schema: PostSchema },
    ]),
    CqrsModule,
  ],
  controllers: [...controllers],
  providers: [
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },

    // Global Filters
    {
      provide: APP_FILTER,
      useClass: SentryExceptionFilter,
    },

    // Repositories
    {
      provide: "PostRepository",
      useClass: MongoPostRepository,
    },

    // Handlers and Services
    ...services,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class AppModule {}
