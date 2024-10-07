"use client";

import Image from "next/image";
import "/app/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react"; // Import signOut

export default function Home() {
  const router = useRouter();

  const logout = async () => {
    await signOut({ callbackUrl: "/login" }); // Use signOut from NextAuth.js
  };

  return (
    <div className="flex flex-col h-screen w-[15%] bg-white shadow-lg">
      <div className="w-full h-[20vh] bg-blue-600 flex items-end justify-center">
        <div className="w-[80%] h-[100%] flex flex-col justify-center items-center">
          <div className="w-[110px] h-[110px] border-[2px] border-white border-solid rounded-full flex justify-center items-center overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <div className="text-white mt-4">Tuvshin Tuguldur</div>
        </div>
      </div>
      <nav className="flex-grow h-max w-full">
        <div className="w-full">
          <Link href="/users">
            <div
              className={`flex justify-center items-center h-12 transition-colors duration-200 ${
                router.pathname === "/users"
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <span
                className={`text-center w-full ${
                  router.pathname === "/users"
                    ? "font-bold text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Users
              </span>
            </div>
          </Link>
        </div>
        <div className="w-full">
          <Link href="/dashboard">
            <div
              className={`flex justify-center items-center h-12 transition-colors duration-200 ${
                router.pathname === "/dashboard"
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <span
                className={`text-center w-full ${
                  router.pathname === "/dashboard"
                    ? "font-bold text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Dashboard
              </span>
            </div>
          </Link>
        </div>
      </nav>
      <div className="w-full h-12 flex justify-center items-center border-t">
        <button
          onClick={logout}
          className="w-full h-full text-center text-red-600 font-semibold hover:bg-red-50 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
