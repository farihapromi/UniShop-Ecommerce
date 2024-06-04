import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const COIN_RATE = 0.1;
const MEMBERSHIP_LEVELS = [
  { level: "Bronze", threshold: 0 },
  { level: "Silver", threshold: 5000 },
  { level: "Gold", threshold: 10000 },
  { level: "Platinum", threshold: 20000 },
];

const getMembershipLevel = (totalSpent) => {
  for (let i = MEMBERSHIP_LEVELS.length - 1; i >= 0; i--) {
    if (totalSpent >= MEMBERSHIP_LEVELS[i].threshold) {
      return MEMBERSHIP_LEVELS[i].level;
    }
  }
  return "Bronze";
};

export const createOrderController = async (req, res) => {
  try {
    const { cart, payment, userId } = req.body;

    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      products: cart.map((item) => item._id),
      payment,
      buyer: userId,
      totalAmount,
    });

    await newOrder.save();

    const user = await User.findById(userId);
    user.totalSpent += totalAmount;
    user.coins += Math.floor(totalAmount * COIN_RATE);
    user.membershipLevel = getMembershipLevel(user.totalSpent);

    await user.save();

    res
      .status(201)
      .json({
        success: true,
        order: newOrder,
        coinsEarned: Math.floor(totalAmount * COIN_RATE),
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
