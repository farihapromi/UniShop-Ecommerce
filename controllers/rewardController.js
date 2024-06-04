import Reward from "../models/rewardModel.js";
import User from "../models/userModel.js";

export const getRewardsController = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const redeemRewardController = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;
    const reward = await Reward.findById(rewardId);
    const user = await User.findById(userId);

    if (user.coins < reward.coins) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    user.coins -= reward.coins;
    await user.save();

    res.json({ success: true, updatedUser: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
