"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

const StoreFront = ({ params }) => {
  const [products, setProducts] = useState([]);
  const { storeslug } = use(params);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/store/${storeslug}/products`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch public products:", error);
      }
    };

    if (storeslug) {
      fetchProducts();
    }
  }, [storeslug]);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        Store: {storeslug}
      </h1>

      {products.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {product.description || "No description"}
              </p>
              <p className="text-blue-600 font-semibold mt-2">
                ${product.price}
              </p>
              <Link
                href={`/store/${storeslug}/product/${product.id}`}
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                View Product
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No products available.</p>
      )}
    </div>
  );
};

export default StoreFront;
