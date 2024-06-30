import { comparePassword, hashPassoword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validation
    if (!name) {
      return res.send({ error: "name isrequired" });
    }
    if (!email) {
      return res.send({ error: "email isrequired" });
    }

    if (!password) {
      return res.send({ error: "password is required" });
    }
    if (!phone) {
      return res.send({ error: "phone is required" });
    }
    if (!address) {
      return res.send({ error: "address is required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        succsess: true,
        message: "already register.Please log in",
      });
    }
    //register user
    const hashedPassword = await hashPassoword(password);
    //save
    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: true,
        message: "Invalid Email and Password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid password",
      });
    }
    //token
    const token = await JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//forgot pass
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassoword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//update profile controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }
    const hashedPassword = password
      ? await hashPassoword(password)
      : "undefined";
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test
export const testController = () => {
  try {
    res.send("protected routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//orders

//create order

export const createOrderController = async (req, res) => {
  try {
    const { products, payment, buyer } = req.body;
    const amount = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    const coins = Math.floor(amount / 100); // 10 coins for each 1000 tk spent

    const newOrder = new orderModel({
      products,
      payment: {
        amount,
        success: payment.success,
      },
      buyer,
      status: "Not Process",
    });

    await newOrder.save();

    // Update user's coins
    const user = await userModel.findById(buyer);
    user.coins = (user.coins || 0) + coins;
    await user.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating order",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    // const user = await userModel.findById(req.user._id);
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//for admin all orders

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//order status contorller
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//coins

// export const getUsersWithOrdersController = async (req, res) => {
//   try {
//     const users = await userModel.find({ role: 0 }).lean(); // Fetch all users except admins
//     const userIds = users.map((user) => user._id);

//     const orders = await orderModel
//       .find({ buyer: { $in: userIds } })
//       .populate("buyer", "name email address phone membershipId")
//       .lean();

//     const usersWithOrders = users.map((user) => {
//       const userOrders = orders.filter(
//         (order) => order.buyer._id.toString() === user._id.toString()
//       );

//       // Calculate total spent by the user
//       const totalSpent = userOrders.reduce(
//         (acc, order) => acc + order.payment.amount,
//         0
//       );

//       // Calculate coins based on total spent
//       const totalCoins = Math.floor(totalSpent / 1000) * 10;

//       return { ...user, coins: totalCoins };
//     });

//     res.json(usersWithOrders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error fetching users with orders",
//       error,
//     });
//   }
// };

//aded for reseting coins
export const getUsersWithOrdersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: 0 }).lean(); // Fetch all users except admins
    const userIds = users.map((user) => user._id);

    const orders = await orderModel
      .find({ buyer: { $in: userIds } })
      .populate("buyer", "name email address phone membershipId coinsUsed")
      .lean();

    const usersWithOrders = users.map((user) => {
      const userOrders = orders.filter(
        (order) => order.buyer._id.toString() === user._id.toString()
      );

      // Calculate total spent by the user
      const totalSpent = userOrders.reduce(
        (acc, order) => acc + order.payment.amount,
        0
      );

      // Use the coins stored in the user document
      const coins = user.coins;

      return { ...user, totalSpent, coins };
    });

    res.json(usersWithOrders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching users with orders",
      error,
    });
  }
};

export const updateUserCoinsController = async (req, res) => {
  try {
    const { userId, paymentAmount } = req.body;

    // Fetch user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate coins
    const newCoins = Math.floor(paymentAmount / 100); // Assuming 10 coins for each 1000tk spent
    user.coins += newCoins;

    // Check if coins exceed threshold
    if (user.coins >= 1000) {
      // Notify user
      // Here you might send an email or notification
      console.log(`User ${user.name} can redeem their coins.`);

      // Reset coins after notifying
      user.coins = 0;
    }
    // Reset coins if they were used
    if (useCoins) {
      user.coins = 0;
    }

    // Save updated user
    await user.save();

    res.status(200).json({ success: true, message: "Coins updated", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating coins", error });
  }
};

//nwly added for coinns using

// export const getUserCoinsController = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.user._id).lean();
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const userOrders = await orderModel.find({ buyer: user._id }).lean();

//     const totalSpent = userOrders.reduce(
//       (acc, order) => acc + order.payment.amount,
//       0
//     );

//     const totalCoins = Math.floor(totalSpent / 1000) * 10;

//     res.json({ coins: totalCoins });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error fetching user coins",
//       error,
//     });
//   }
// };

// added for newly created problem 30.06.2024
export const getUserCoinsController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's stored coins
    res.json({ coins: user.coins });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching user coins",
      error,
    });
  }
};

// export const handlePaymentController = async (req, res) => {
//   try {
//     const { nonce, userId, paymentAmount, useCoins } = req.body;
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Calculate total amount and coins deduction
//     let finalAmount = paymentAmount;
//     if (useCoins && user.coins >= 100) {
//       finalAmount -= 100;
//       user.coins -= 100;
//     }

//     // Perform payment processing with the final amount (using Braintree)
//     const paymentResult = await gateway.transaction.sale({
//       amount: finalAmount.toString(),
//       paymentMethodNonce: nonce,
//       options: {
//         submitForSettlement: true,
//       },
//     });

//     if (!paymentResult.success) {
//       return res.status(500).json({ message: "Payment processing failed" });
//     }

//     // Save the order in the database
//     const order = new orderModel({
//       buyer: user._id,
//       products: req.body.products,
//       payment: {
//         amount: finalAmount,
//         transactionId: paymentResult.transaction.id,
//       },
//     });

//     await order.save();

//     // Calculate and update coins for the user
//     const newCoins = Math.floor(finalAmount / 1000) * 10;
//     user.coins += newCoins;
//     await user.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Payment successful", user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Payment failed", error });
//   }
// };
