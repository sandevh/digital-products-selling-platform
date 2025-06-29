"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

const ProductPage = ({ params }) => {
  const { storeslug, productId } = use(params);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

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

  const handleBuyClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setBuyerEmail("");
  };

  const handleConfirmPurchase = async () => {
    try {
      const response = await fetch(`/api/checkout/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerEmail }),
      });

      const data = await response.json();

      if (data.success) {
        handleModalClose();
        setPurchaseSuccessful(true);
        setOrderDetails(data.order);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
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
            onClick={handleBuyClick}
          >
            Buy Now
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              Enter Your Email
            </h2>
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="you@example.com"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {purchaseSuccessful && orderDetails && (
        <div className="max-w-xl mx-auto mt-10 border border-blue-300 bg-blue-50 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
            Purchase Confirmed!
          </h2>
          <p>
            <strong>Order ID:</strong> {orderDetails.id}
          </p>
          <p>
            <strong>Product ID:</strong> {orderDetails.productId}
          </p>
          <p>
            <strong>Email:</strong> {orderDetails.buyerEmail}
          </p>
          <p>
            <strong>Placed At:</strong>{" "}
            {new Date(orderDetails.createdAt).toLocaleString()}
          </p>
          <Link
            href={"/"}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
