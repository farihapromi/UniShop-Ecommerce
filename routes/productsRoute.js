import express from "express";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  prodcuctCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
  getReviewsController,
  addReviewController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();
//router,isAdmin o hobe
//formidable is used for photo
router.post(
  "/create-product",
  requireSignIn,
  formidable(),
  createProductController
);
//update products
router.put(
  "/update-product/:pid",
  requireSignIn,
  formidable(),
  updateProductController
);
//get products
router.get("/get-product", getProductController);
//single products
router.get("/get-product/:slug", getSingleProductController);

//for photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);
//filtered product
router.post("/product-filters", productFiltersController);

//for pagination
router.get("/product-count", productCountController);
//product per page
router.get("/product-list/:page", productListController);
//search
router.get("/search/:keyword", searchProductController);
//related product controller
router.get("/related-product/:pid/:cid", relatedProductController);

//categori wise products
router.get("/product-category/:slug", prodcuctCategoryController);

//payment gateway
//token
router.get("/braintree/token", braintreeTokenController);
//payment
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

// Route for handling Braintree payment
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
//rewards

import {
  getRewardsController,
  redeemRewardController,
} from "../controllers/rewardController.js";
//newly added

router.get("/rewards", getRewardsController);
router.post("/redeem", redeemRewardController);

router.post("/add-review", requireSignIn, addReviewController);
router.get("/reviews/:productId", getReviewsController);

//newly added
// Get products within user's coin value

export default router;
