import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      type: {},
      required: true,
    },
    //phone ewly added
    phone: { type: String, required: true },
    role: {
      type: Number,
      default: 0,
    },
    totalSpent: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    membershipId: { type: String },
    membershipLevel: { type: String, default: "Bronze" }, // Example levels: Bronze, Silver, Gold, Platinum
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
