"use client";

import { use, useEffect, useState } from "react";

const ProductPage = ({ params }) => {
  const { storeslug, productId } = use(params);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("sample@buyer.com");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/store/${storeslug}/products/${productId}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load product");
        } else {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("An error occurred");
      }
    };

    if (storeslug && productId) {
      fetchProduct();
    }
  }, [storeslug, productId]);

  const buyProduct = async () => {
    try {
      const response = await fetch(`/api/checkout/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerEmail: buyerEmail,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("purchase successfull!!!");
      }
    } catch {
      console.error("Error purchasing product: ", error);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Product Details – {storeslug}
      </h1>

      {error && <p className="text-red-500 text-center font-medium">{error}</p>}

      {!error && product && (
        <div className="max-w-xl mx-auto border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold">{product.title}</h2>
          <p className="mt-2 text-gray-700">
            {product.description || "No description provided."}
          </p>
          <p className="mt-4 text-blue-600 font-semibold text-lg">
            ${product.price}
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-2xl shadow-md transition duration-300 ease-in-out hover:cursor-pointer"
            onClick={buyProduct}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
