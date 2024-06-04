import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryProductStyles.css";

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const params = useParams();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, [params?.slug]);
  return (
    <Layout title={"All Categories"}>
      <div className="container mt-3 category">
        <h1 className="text-center category-name">
          Category - {category?.name}
        </h1>
        <h1 className="text-center">{products?.length}</h1>
        <div className="row">
          <div className="d-flex flex-wrap">
            {products?.map((product) => (
              <div className="card m-2" style={{ width: "18rem;" }}>
                <img
                  src={`/api/v1/products/product-photo/${product._id}`}
                  className="card-img-top  "
                  alt={product.name}
                  height={"200px"}
                />

                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.description.substring(0, 30)}
                  </p>
                  <p className="card-text"> Price:{product.price}</p>
                  <div className="card-name-price">
                    <button
                      class="btn btn-primary ms-1"
                      onClick={() => navigate(`/products/${product.slug}`)}
                    >
                      More Details
                    </button>

                    <button class="btn btn-secondary ms-1">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="m-2 p-3">
              {products && products.length < total && (
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading ..." : <> Loadmore</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
