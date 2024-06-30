import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCoins, setUserCoins] = useState(0); // State for user's current coins
  const [useCoins, setUseCoins] = useState(false); // State for using coins
  const navigate = useNavigate();

  const calculateQuantity = (productId) => {
    let quantity = 0;
    cart.forEach((item) => {
      if (item._id === productId) {
        quantity++;
      }
    });
    return quantity;
  };

  const uniqueProductIds = [...new Set(cart.map((item) => item._id))];

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });

      // Apply discount if user has enough coins
      if (useCoins && userCoins >= 100) {
        const discount = Math.min(userCoins, total); // Use all available coins but not more than the total price
        total -= discount;
        toast.success(
          `You have used ${discount} coins to get a discount of $${discount}!`
        );
      }
      return total;
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCoins = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/user-coins");
      setUserCoins(data.coins);
    } catch (error) {
      console.log(error);
    }
  };

  // const handlePayment = async () => {
  //   try {
  //     setLoading(true);
  //     const { nonce } = await instance.requestPaymentMethod();
  //     let totalAmount = cart.reduce((total, item) => total + item.price, 0);

  //     // Apply discount if user wants to use coins
  //     let coinsToUse = 0;
  //     if (useCoins && userCoins >= 100) {
  //       coinsToUse = Math.min(userCoins, totalAmount);
  //       totalAmount -= coinsToUse;
  //     }

  //     const { data } = await axios.post("/api/v1/products/braintree/payment", {
  //       nonce,
  //       cart,
  //       totalAmount,
  //       useCoins,
  //     });

  //     setLoading(false);
  //     setCart([]);
  //     localStorage.removeItem("cart");
  //     navigate("/dashboard/user/orders");

  //     toast.success("Payment Completed Successfully ");

  //     // Reset userCoins to 0 after using them
  //     if (useCoins) {
  //       setUserCoins(0);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      let totalAmount = cart.reduce((total, item) => total + item.price, 0);

      // Apply discount if user wants to use coins
      let coinsToUse = 0;
      if (useCoins && userCoins >= 100) {
        coinsToUse = Math.min(userCoins, totalAmount);
        totalAmount -= coinsToUse;
      }

      const { data } = await axios.post("/api/v1/products/braintree/payment", {
        nonce,
        cart,
        totalAmount,
        useCoins,
      });

      setLoading(false);
      setCart([]);
      localStorage.removeItem("cart");
      navigate("/dashboard/user/orders");

      toast.success("Payment Completed Successfully");

      // Reset userCoins to 0 after using them
      if (useCoins) {
        setUserCoins(0);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
    if (auth?.user) {
      getUserCoins();
    }
  }, [auth?.token]);

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12 cart-card">
            <h1 className="text-center heading p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You have ${cart.length} items in your cart`
                  : "Your Cart is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6 p-0 m-0">
              {uniqueProductIds.map((productId) => {
                const product = cart.find((item) => item._id === productId);
                return (
                  <div className="row card flex-row" key={productId}>
                    <div className="col-md-4">
                      <img
                        src={`/api/v1/products/product-photo/${productId}`}
                        className="card-img-top"
                        alt={product.name}
                        width="100%"
                        height="130px"
                      />
                    </div>
                    <div className="col-md-4">
                      <p>{product.name}</p>
                      {product.description && (
                        <p>{product.description.substring(0, 30)}</p>
                      )}
                      <p>Price: {product.price}</p>
                      <p>Quantity: {calculateQuantity(productId)}</p>
                    </div>
                    <div className="col-md-4 cart-remove-btn">
                      <button
                        className="btn btn-danger"
                        onClick={() => removeCartItem(productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {totalPrice()}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                    {userCoins >= 100 && (
                      <div className="mt-3">
                        <label>
                          <input
                            type="checkbox"
                            checked={useCoins}
                            onChange={() => setUseCoins(!useCoins)}
                          />
                          Use {userCoins} coins for a discount of ${userCoins}
                        </label>
                        <p>You have {userCoins} coins available.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
