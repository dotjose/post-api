import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class PostDocument extends Document {
  @Prop({ required: true, enum: ["blog", "event"], default: "blog" })
  type: "blog" | "event";

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  subTitle?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  authorId: string;

  @Prop([String])
  featureImg?: string[];

  @Prop()
  eventStart?: Date;

  @Prop()
  eventEnd?: Date;

  @Prop({
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: (value: number[]) => {
          return (
            Array.isArray(value) && value.length === 2 && !value.includes(NaN)
          );
        },
        message: "Coordinates must contain exactly [longitude, latitude].",
      },
    },
    address: String,
    country: String,
    city: String,
    state: String,
  })
  location?: {
    type?: "Point";
    coordinates?: [number, number];
    address?: string;
  };

  @Prop({ default: false })
  isPublished: boolean;

  @Prop([String])
  tags?: string[];
}

export const PostSchema = SchemaFactory.createForClass(PostDocument);

// Indexes for better performance
PostSchema.index(
  { location: "2dsphere" },
  {
    partialFilterExpression: {
      location: { $exists: true },
      "location.type": "Point",
      "location.coordinates": { $exists: true, $type: "array" },
    },
    background: true,
  }
);

PostSchema.index({ type: 1 });
PostSchema.index({ isPublished: 1 });
PostSchema.index({ authorId: 1 });
