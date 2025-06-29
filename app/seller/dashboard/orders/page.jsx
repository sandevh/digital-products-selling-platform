"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderPage = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch("/api/seller/orders");
      const data = await response.json();
      setOrders(data?.orders || []);
    } catch (error) {
      console.error("Error fetching orders: ", error);
      setError("Failed to load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    fetchOrders();
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="w-full h-full bg-black text-white font-bold text-9xl">
        Order Splash...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-extrabold">
        Welcome <span>{user.username}</span>
      </h2>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Link
          href="/seller/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Dashboard
        </Link>
      </header>
      <div>
        {ordersLoading ? (
          <p className="mt-4 text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-gray-500">No orders found.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">
                  {order.product?.title || "Untitled Product"}
                </h3>
                <p className="text-sm text-gray-600">
                  {order.product?.description || "No description"}
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  ${order.product?.price?.toFixed(2) || "0.00"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Buyer: <span className="font-medium">{order.buyerEmail}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Ordered on: {new Date(order.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
