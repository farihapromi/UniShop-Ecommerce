import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./../components/Layout/Layout";
import ReviewForm from "./ReviewForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [highestRating, setHighestRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getReviews(data?.product._id);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async (productId) => {
    try {
      const { data } = await axios.get(`/api/v1/products/reviews/${productId}`);
      setReviews(data?.reviews);
      findHighestRating(data?.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const findHighestRating = (reviews) => {
    if (reviews.length === 0) {
      setHighestRating(0);
      return;
    }
    const highest = Math.max(...reviews.map((review) => review.rating));
    setHighestRating(highest);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={`star ${index < rating ? "filled" : ""}`}
      />
    ));
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="container product-details">
        <div className="row">
          <div className="col-md-6">
            <img
              src={`/api/v1/products/product-photo/${product._id}`}
              className="img-fluid rounded"
              alt={product.name}
            />
          </div>
          <div className="col-md-6 product-details-info">
            <h1 className="text-center product-detail">Product Details</h1>
            <hr />
            <h6>
              <strong>Name:</strong> {product.name}
            </h6>
            <h6>
              <strong>Description:</strong> {product.description}
            </h6>
            <h6>
              <strong>Price:</strong>{" "}
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h6>
            <h6>
              <strong>Highest Rating:</strong> {renderStars(highestRating)}
            </h6>
            <h6>
              <strong>Category:</strong> {product?.category?.name}
            </h6>
            <button className="btn btn-secondary mt-3">ADD TO CART</button>
          </div>
        </div>
        <hr />
        {/* similar products */}

        <div>
          <div className="row mt-4">
            <div className="col-md-12">
              <ReviewForm
                productId={product._id}
                refreshReviews={() => getReviews(product._id)}
              />
            </div>
          </div>
          <hr />
          <div className="row mt-4">
            <div className="col-md-12">
              <h4 className="customer-review">Customer Reviews</h4>
              {reviews.length === 0 && <p>No reviews yet</p>}
              {reviews.map((review) => (
                <div key={review._id} className="review card p-3 mb-3">
                  <h5>{review.user.name}</h5>
                  <p>
                    <strong>Rating:</strong> {renderStars(review.rating)}
                  </p>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="row container similar-products">
            <h4>Similar Products ➡️</h4>
            {relatedProducts.length < 1 && (
              <p className="text-center">No Similar Products found</p>
            )}
            <div className="d-flex flex-wrap">
              {relatedProducts?.map((p) => (
                <div className="card m-2" key={p._id}>
                  <img
                    src={`/api/v1/products/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <p className="card-text ">
                      {p.description.substring(0, 60)}...
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1"
                        onClick={() => navigate(`/products/${p.slug}`)}
                      >
                        More Details
                      </button>
                      {/* <button
                  className="btn btn-dark ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, p])
                    );
                    toast.success("Item Added to cart");
                  }}
                >
                  ADD TO CART
                </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
