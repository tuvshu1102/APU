"use client";

import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { FaHome, FaUsers, FaChartBar, FaSignOutAlt } from "react-icons/fa"; // Import icons

export default function Sidebar() {
  const router = useRouter();

  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col h-screen w-[200px] bg-[#1B1B1B] shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-600">
        <h1 className="text-2xl font-bold text-white">My App</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => router.push("/")}
              className={`flex items-center p-4 w-full text-left transition-colors duration-200 hover:bg-blue-600 hover:text-white ${
                router.pathname === "/"
                  ? "bg-blue-700 text-white"
                  : "text-gray-400"
              }`}
            >
              <FaHome className="mr-3" /> Home
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/users")}
              className={`flex items-center p-4 w-full text-left transition-colors duration-200 hover:bg-blue-600 hover:text-white ${
                router.pathname === "/users"
                  ? "bg-blue-700 text-white"
                  : "text-gray-400"
              }`}
            >
              <FaUsers className="mr-3" /> Users
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/dashboard")}
              className={`flex items-center p-4 w-full text-left transition-colors duration-200 hover:bg-blue-600 hover:text-white ${
                router.pathname === "/dashboard"
                  ? "bg-blue-700 text-white"
                  : "text-gray-400"
              }`}
            >
              <FaChartBar className="mr-3" /> Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/")}
              className={`flex items-center p-4 w-full text-left transition-colors duration-200 hover:bg-blue-600 hover:text-white ${
                router.pathname === "/"
                  ? "bg-blue-700 text-white"
                  : "text-gray-400"
              }`}
            >
              <FaChartBar className="mr-3" /> dunno1
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/")}
              className={`flex items-center p-4 w-full text-left transition-colors duration-200 hover:bg-blue-600 hover:text-white ${
                router.pathname === "/"
                  ? "bg-blue-700 text-white"
                  : "text-gray-400"
              }`}
            >
              <FaChartBar className="mr-3" /> dunno2
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-600">
        <button
          onClick={logout}
          className="flex items-center w-full p-4 text-left text-red-500 hover:bg-red-600 hover:text-white"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </div>
    </div>
  );
}
