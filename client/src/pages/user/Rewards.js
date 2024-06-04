import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";

const Rewards = () => {
  const [auth, setAuth] = useAuth();
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      const { data } = await axios.get("/api/v1/rewards");
      setRewards(data);
    };
    fetchRewards();
  }, []);

  const handleRedeem = async () => {
    try {
      const { data } = await axios.post("/api/v1/redeem", {
        userId: auth.user._id,
        rewardId: selectedReward,
      });
      toast.success("Reward redeemed successfully!");
      // Update user coins
      const updatedUser = { ...auth.user, coins: data.updatedUser.coins };
      setAuth({ ...auth, user: updatedUser });
    } catch (error) {
      toast.error("Failed to redeem reward.");
    }
  };

  return (
    <Layout title={"Rewards"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-8">
            <h4 className="title">Rewards</h4>
            <ul className="list-group">
              {rewards.map((reward) => (
                <li
                  key={reward._id}
                  className="list-group-item"
                  onClick={() => setSelectedReward(reward._id)}
                >
                  {reward.name} - {reward.coins} Coins
                </li>
              ))}
            </ul>
            <button className="btn btn-primary mt-3" onClick={handleRedeem}>
              Redeem
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Rewards;
