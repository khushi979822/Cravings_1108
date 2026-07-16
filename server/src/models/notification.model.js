import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "general",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("notification", NotificationSchema);
export default Notification;
