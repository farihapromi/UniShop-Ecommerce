import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Boolean,
      required: false,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        rating: { type: Number, required: true },
      },
    ],
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
