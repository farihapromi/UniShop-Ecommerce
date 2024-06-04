import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewForm = ({ productId, refreshReviews }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      const response = await axios.post("/api/v1/products/add-review", {
        productId,
        rating,
        comment,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setRating(0);
        setComment("");
        refreshReviews(); // Refresh reviews after submission
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error submitting review");
      console.log(error);
    }
  };

  return (
    <div className="review-form">
      <h4 className="rate">Rate this Product</h4>
      <div>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          className="form-control"
          placeholder="Enter rating (1-5)"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
          placeholder="Enter your review"
          rows="3"
        />
        <button className="btn btn-primary mt-2" onClick={submitReview}>
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
