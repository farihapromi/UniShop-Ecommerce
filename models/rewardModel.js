import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);
