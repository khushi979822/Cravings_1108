import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../images/bgImage1-BgVBBcls.jpg";
import api from "../config/api.config";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      toast.success(res.data.message);
      sessionStorage.setItem("cravingUser", JSON.stringify(res.data.data));
      setUser(res.data.data);
      setIsLogin(true);
      setRole(res.data.data.userType);

      if (res.data.data.userType === "restaurant") {
        navigate("/restaurant-dashboard");
      } else if (res.data.data.userType === "rider") {
        navigate("/rider-dashboard");
      } else if (res.data.data.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.status +
          " | " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
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

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <label className="font-semibold">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              Remember
            </label>

            <a href="#" className="text-orange-500 hover:text-orange-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
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
