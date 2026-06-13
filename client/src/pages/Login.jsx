import { Link } from "react-router-dom";
import { useState } from "react";
import foodTable from "../images/foodTable.webp";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("userName :", userName);
    console.log("password :", password);
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `url(${foodTable})`
      }}
    >
      <div className="w-full px-6 lg:px-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-xl bg-white px-10 py-8 shadow-lg"
        >
          <h2 className="mb-1 text-center text-3xl font-bold text-red-800">
            Welcome Back
          </h2>

          <p className="mb-6 text-center text-gray-500">
            Login to your Cravings account
          </p>

          <label className="mb-2 block font-bold">Email</label>
          <input
            type="email"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your email"
            className="mb-4 w-full rounded-md border px-4 py-3 outline-none focus:border-red-700"
          />

          <label className="mb-2 block font-bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mb-4 w-full rounded-md border px-4 py-3 outline-none focus:border-red-700"
          />

          <div className="mb-5 flex items-center justify-between text-sm">
            <label>
              <input type="checkbox" className="mr-2" />
              Remember
            </label>

            <a href="#" className="text-red-700">
              Forgot password?
            </a>
          </div>

          <button className="mb-5 w-full rounded-md bg-red-700 py-3 font-bold text-white hover:bg-red-800">
            Login
          </button>

          <div className="mb-4 flex items-center gap-2 text-gray-500">
            <hr className="flex-1" />
            <span>Don't have an account?</span>
            <hr className="flex-1" />
          </div>

          <p className="text-center">
            <Link to="/register" className="font-semibold text-red-700">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
