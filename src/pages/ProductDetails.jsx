import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/pagesesStyles.css";
import { BiCartAdd } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import { useCart } from "../context/cart";
import { serverUrl } from "../serverUrl";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const [product, setProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const { slug } = useParams();

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/v1/product/products/${slug}`
      );
      if (data.success) {
        setProduct(data.product);
        getSimilarProduct(data?.product._id, data?.product.category._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/v1/product//related-product/${pid}/${cid}`
      );
      if (data.success) {
        setRelatedProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (slug) {
      getProduct();
    }
  }, [product]);

  // console.log(product)
  // console.log(relatedProducts)

  // Scroll to top
  const handleSeeProduct = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <Layout>
      <h4 className="text-center header_text">Product Details</h4>
      <div className="productDetails_product">
        <div className="productDetails_image">
          <img
            src={`${serverUrl}/api/v1/product/product-photo/${product?._id}`}
            className="card-img-top"
            alt="product image"
          />
        </div>
        <div className="productDetails_content">
          <h5 className="productDetails_content-product_name">
            {product?.name}
          </h5>
          <p className="productDetails_content-product_text">
            {product?.description}
          </p>

          <div className="productDetails_content-product_price">
            <h2 className="productDetails_content-product_priviosPrice">
              {product?.price && `$${product?.price + 7}`}
            </h2>
            <h2 className="productDetails_content-product_currentPrice">
              ${product?.price}
            </h2>
          </div>

          <button
            className="button_primary"
            onClick={() => {
              setCart([...cart, product]);
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item Added");
            }}
          >
            add to cart
          </button>
        </div>
      </div>

      <br />
      <br />
      <hr />
      <h4 className="text-center header_text">Related Products</h4>
      <div className="productDetails_related-products-container">
        {relatedProducts?.map((product) => (
          <div key={product._id} className="productDetails_related-products">
            <div className="productDetails_related-products-img">
              <img
                src={`${serverUrl}/api/v1/product/product-photo/${product?._id}`}
                className="card-img-top"
                alt="product image"
              />
            </div>
            <div className="productDetails_related-products-content">
              <h5>{product.name}</h5>
              <p>
                {product?.description.length > 200
                  ? product?.description.substring(0, 200)
                  : product.description}
              </p>
              <h4>${product.price}</h4>

              <div className="productDetails_related-products-content-footer">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={handleSeeProduct}
                  className="button_primary"

                >
                  <BsFillEyeFill />
                </Link>
                <button
                  className="button_primary"
                  onClick={() => {
                    setCart([...cart, product]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, product])
                    );
                    toast.success("Item Added", {
                      position: toast.POSITION.BOTTOM_RIGHT,
                      autoClose: 2000,
                    });
                  }}
                >
                  <BiCartAdd />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ProductDetails;
