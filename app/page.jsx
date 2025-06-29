"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchPublicProducts = async () => {
      try {
        const res = await fetch("/api/store");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch public products:", err);
      }
    };
    fetchPublicProducts();
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/seller/dashboard");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-full bg-black text-white font-bold text-9xl">
        Home Splash...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6">
        Welcome to the Platform
      </h1>

      {/* Auth Buttons */}
      <nav className="mb-10 flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          Signup
        </Link>
      </nav>

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Featured Products
        </h2>

        {products.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <li
                key={product.id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description || "No description"}
                </p>
                <p className="mt-2 text-blue-600 font-semibold">
                  ${product.price}
                </p>
                <Link
                  href={`/store/${product.store.slug}/product/${product.id}`}
                  className="text-indigo-600 underline hover:text-indigo-800"
                >
                  View product
                </Link>
                {product.store && (
                  <p className="text-sm mt-3">
                    Visit store:{" "}
                    <Link
                      href={`/store/${product.store.slug}`}
                      className="text-indigo-600 underline hover:text-indigo-800"
                    >
                      {product.store.name}
                    </Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No products to display yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
