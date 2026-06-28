import React, { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../images/bgImage1-BgVBBcls.jpg";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: userName,
      password,
      page: "login",
      action: "sign_in",
    };

    console.log("Login payload ready for backend:", payload);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-start px-8 md:px-20 py-8 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-8 rounded-xl bg-white shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

          <p className="text-center text-gray-500 mb-2">
            Login to your Craving account
          </p>

          <label className="font-semibold">Email</label>

          <input
            type="email"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="font-semibold">Password</label>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
              👁️
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember
            </label>

            <a href="#" className="text-orange-500 hover:text-orange-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            Login
          </button>

          <div className="flex items-center gap-3">
            <hr className="flex-1" />
            <span className="text-sm text-gray-500">
              Don't have an account?
            </span>
            <hr className="flex-1" />
          </div>

          <p className="text-center">
            <Link
              to="/register"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
