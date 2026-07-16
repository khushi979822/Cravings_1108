import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
    },
    restaurantRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    restaurantReview: {
      type: String,
      trim: true,
    },
    riderRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    riderReview: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("review", ReviewSchema);
export default Review;
