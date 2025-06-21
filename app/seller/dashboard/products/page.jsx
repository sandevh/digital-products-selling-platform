"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/seller/products");
      const data = await response.json();
      setProducts(data?.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Product added successfully");
        setFormData({ title: "", description: "", price: "" });
        fetchProducts();
      } else {
        alert(`Failed to add product: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        alert(`Failed to delete product: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link
          className="bg-blue-600 px-4 py-2 rounded-lg text-white"
          href="/seller/dashboard"
        >
          Dashboard
        </Link>
      </header>
      <h1 className="text-2xl font-bold">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          step="0.01"
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>

      <hr className="border-gray-300" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition relative"
                  >
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.description || "No description"}
                    </p>
                    <p className="text-blue-600 font-semibold mt-2">
                      ${product.price}
                    </p>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No products added yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
