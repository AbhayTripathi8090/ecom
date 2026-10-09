import mongoose, { Schema, Model } from "mongoose";

export enum NotificationType {
  USER_REGISTERED = "USER_REGISTERED",
  ORDER_PLACED = "ORDER_PLACED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
}

export interface INotification {
  type: NotificationType;
  title: string;
  message: string;
  entityId?: mongoose.Types.ObjectId | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.model<INotification>(
    "Notification",
    notificationSchema
  );

export default Notification;