import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
//gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countaTotal: products.length,
      message: "All prodcuts",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in getting prodcuts",
    });
  }
};

//single prodicts
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getitng single product",
      error,
    });
  }
};
//photo controller
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in  while getting photo product",
    });
  }
};
//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("photo");
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in  while deleteting  product",
    });
  }
};
//update
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};
//filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};
//product count for pagination
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};
//prodcut per page
// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
//search function
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in searching product",
    });
  }
};
//related product,similar
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in getting related product",
    });
  }
};
//category wise product
export const prodcuctCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({
      success: true,
      products,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in getting category wise product",
    });
  }
};
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//payment actual

// export const brainTreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       function (error, result) {
//         if (result) {
//           const order = new orderModel({
//             products: cart,
//             payment: result,
//             buyer: req.user._id,
//           }).save();
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

//newly added
// export const brainTreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart, totalAmount } = req.body;

//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: totalAmount,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       async function (error, result) {
//         if (result) {
//           const order = new orderModel({
//             products: cart,
//             payment: {
//               amount: totalAmount, // Set the total amount here
//               success: result.success,
//             },
//             buyer: req.user._id,
//           });
//           await order.save();
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error processing payment",
//       error,
//     });
//   }
// };
//added for coins reseting
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart, totalAmount, useCoins } = req.body;

    // Fetch user from the database
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let finalAmount = totalAmount;
    const coinsToUse = useCoins && user.coins >= 100 ? 100 : 0;

    if (coinsToUse > 0) {
      finalAmount -= coinsToUse;
      user.coins = 0; // Reset user's coins after using them
    }

    // Create transaction using Braintree gateway
    gateway.transaction.sale(
      {
        amount: finalAmount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error });
        }

        // Calculate coins earned from this transaction (10 coins per 1000 spent)
        const coinsEarned = Math.floor(finalAmount / 1000) * 10;

        // Update user's coins if not using coins or after using them
        if (coinsToUse === 0) {
          user.coins += coinsEarned;
        }

        // Save order in database
        const order = new orderModel({
          products: cart,
          payment: {
            amount: finalAmount,
            success: result.success,
          },
          buyer: req.user._id,
          coinsUsed: coinsToUse, // Record coins used in this order
        });

        await order.save();
        await user.save();

        return res.json({ success: true });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// this is for use all coins latest updatee
// export const brainTreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart, totalAmount, useCoins } = req.body;

//     // Fetch user from the database
//     const user = await userModel.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let finalAmount = totalAmount;
//     let coinsToUse = 0;

//     if (useCoins && user.coins >= 100) {
//       coinsToUse = user.coins;
//       finalAmount -= coinsToUse;
//       user.coins = 0; // Reset user's coins after using them
//     }

//     // Create transaction using Braintree gateway
//     gateway.transaction.sale(
//       {
//         amount: finalAmount,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       async (error, result) => {
//         if (error) {
//           return res.status(500).json({ error });
//         }

//         // Calculate coins earned from this transaction (10 coins per 1000 spent)
//         const coinsEarned = Math.floor(finalAmount / 1000) * 10;

//         // Update user's coins
//         user.coins += coinsEarned;

//         // Save order in database
//         const order = new orderModel({
//           products: cart,
//           payment: {
//             amount: finalAmount,
//             success: result.success,
//           },
//           buyer: req.user._id,
//           coinsUsed: coinsToUse, // Record coins used in this order
//         });

//         await order.save();
//         await user.save();

//         return res.json({ success: true });
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error });
//   }
// };

//review

export const addReviewController = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !comment || !productId) {
      return res.status(400).send({
        success: false,
        message: "Rating, comment, and product ID are required",
      });
    }

    // Find the product by ID
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user has already reviewed the product
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).send({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Add a new review
    const review = {
      user: userId,
      rating,
      comment,
    };

    product.reviews.push(review);

    // Save the updated product
    await product.save();

    res.status(200).send({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error adding review",
      error,
    });
  }
};

export const getReviewsController = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel
      .findById(productId)
      .select("reviews")
      .populate("reviews.user", "name");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching reviews",
      error,
    });
  }
};
