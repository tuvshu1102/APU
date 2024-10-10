import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import "/app/globals.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null); // State to handle error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError(result.error); // Set error state if there is an error
    } else {
      router.push("/dashboard"); // Redirect to dashboard on successful login
    }
  };

  return (
    <div className="flex items-center justify-center font-custom min-h-screen bg-gradient-to-bl from-blue-500 via-indigo-600 to-purple-700 text-white">
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-2xl shadow-xl p-10 relative">
        <div className="absolute top-[-3rem] left-1/2 transform -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-200 mb-8 mt-8">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-gray-400 font-semibold mb-2"
            >
              Нэвтрэх нэр
            </label>
            <input
              className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-500 transition-all duration-200 ease-in-out"
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-gray-400 font-semibold mb-2"
            >
              Нууц үг
            </label>
            <input
              className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-500 transition-all duration-200 ease-in-out"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="mb-6 text-red-400 text-center font-semibold">
              {error}
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-bold text-lg text-white shadow-md hover:bg-gradient-to-l transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Нэвтрэх
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
