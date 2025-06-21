"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "GET" });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-extrabold">
        Welcome <span>{user.username}</span>
      </h2>

      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <button
          onClick={handleLogOut}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <nav className="space-x-4">
        <Link
          href="/seller/dashboard/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Manage Products
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;
