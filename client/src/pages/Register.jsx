import React, { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../images/bgImage1-BgVBBcls.jpg";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      role,
      fullName,
      email,
      phone: phoneNumber,
      gender,
      password,
      "confirm password": confirmPassword,
      dob,
      page: "register",
      action: "sign_up",
    };

    console.log("Register payload ready for backend:", payload);
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
          className="bg-(--background) rounded-xl shadow-lg p-8 flex flex-col gap-4"
        >
          <h2 className="text-3xl font-bold text-center">Create Account</h2>

          <p className="text-center text-gray-500">
            Join us as a Customer, Restaurant, or Rider
          </p>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" />
            <span>
              I agree to the{" "}
              <a href="#" className="text-orange-500 hover:text-orange-600">
                terms and conditions
              </a>
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text--(primary-text) font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            Register
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
