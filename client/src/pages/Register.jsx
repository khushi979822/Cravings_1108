import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import heroImage from "../images/bgImage1-BgVBBcls.jpg";
import api from "../config/api.config";
import toast from "react-hot-toast";

function Register() {
  const { userType: paramUserType } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: paramUserType || "customer",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!data.phone.trim()) newErrors.phone = "Phone number is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.dob) newErrors.dob = "Date of birth is required";
    if (!data.password || data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!data.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!data.agreeTerms)
      newErrors.agreeTerms = "You must agree to terms and conditions";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        ...formData,
        email: formData.email.toLowerCase(),
      });
      toast.success(res.data.message || "Account created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end px-15 py-8 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4"
        >
          <h2 className="text-3xl font-bold text-center">Create Account</h2>

          <p className="text-center text-gray-500">
            Join us as a Customer, Restaurant, or Rider
          </p>

          {/* User Type Selection */}
          <div>
            <label className="font-semibold text-sm block mb-1">Register As</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="rider">Rider</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

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

          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="mt-1"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-orange-500 hover:text-orange-600">
                terms and conditions
              </a>
            </span>
          </label>
          {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center text-sm">
            <span className="text-gray-500">Already registered?</span>{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
