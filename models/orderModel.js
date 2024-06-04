import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    // payment: {},
    // payment: {
    //   type: Number,
    //   required: true,
    //   // success: { type: Boolean, required: true, default: false },
    // },
    payment: {
      amount: { type: Number, required: true },
      success: { type: Boolean, required: true, default: false },
      // Add any other fields as needed
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },

  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
