import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getUsersWithOrdersController,
  updateUserCoinsController,
  createOrderController,
  getUserCoinsController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//register""POST"
router.post("/register", registerController);
//login
router.post("/login", loginController);
//test
router.get("/test", requireSignIn, isAdmin, testController);
//protected route for user auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
//route a isAdmin chilo
router.get("/admin-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//fogot password
router.post("/forgot-password", forgotPasswordController);
//update profile
router.put("/profile", requireSignIn, updateProfileController);
//orders
router.get("/orders", requireSignIn, getOrdersController);
//all orders for admin,isAdmin o hobe route a
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
//order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//newly added
router.get(
  "/users-with-orders",
  requireSignIn,
  isAdmin,
  getUsersWithOrdersController
);
//newly added
// router.get("/user-coins/:userId", getUserCoinsController);
router.get("/user-coins", requireSignIn, getUserCoinsController);
router.post("/update-coins", requireSignIn, isAdmin, updateUserCoinsController);

// router.get(
//   "/users-with-orders",
//   requireSignIn,
//   // isAdmin,
//   getUsersWithOrdersController
// );
// router.post("/assign-membership", requireSignIn, isAdmin, async (req, res) => {
//   try {
//     const { userId, membershipId } = req.body;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.membershipId = membershipId;
//     await user.save();
//     res.status(200).json({ success: true, message: "Membership ID assigned" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/users", requireSignIn, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.post("/create-order", requireSignIn, createOrderController);
//newly added
// router.post("/handle-payment", handlePaymentController);

export default router;
