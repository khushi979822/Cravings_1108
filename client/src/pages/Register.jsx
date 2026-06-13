import { Link } from "react-router-dom";
import foodTable from "../images/foodTable.webp";

function Register() {
  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `url(${foodTable})`
      }}
    >
      <div className="flex w-full justify-end px-6 lg:px-20">
        <div className="w-full max-w-lg rounded-xl bg-white/90 px-10 py-8 shadow-lg">
          <h2 className="mb-1 text-center text-3xl font-bold text-red-800">
            Create Account
          </h2>

          <p className="mb-5 text-center text-gray-500">
            Join us as a Customer, Restaurant, or Rider
          </p>

          <label className="mb-2 block font-medium">Register as:</label>

          <div className="mb-4 flex gap-4">
            <label>
              <input type="radio" name="role" defaultChecked /> Customer
            </label>
            <label>
              <input type="radio" name="role" /> Restaurant
            </label>
            <label>
              <input type="radio" name="role" /> Rider
            </label>
          </div>

          <input
            className="mb-3 w-full rounded-md border px-4 py-3"
            placeholder="Enter your full name"
          />
          <input
            className="mb-3 w-full rounded-md border px-4 py-3"
            placeholder="Enter your email"
          />
          <input
            className="mb-3 w-full rounded-md border px-4 py-3"
            placeholder="Enter your phone number"
          />
          <input
            className="mb-3 w-full rounded-md border px-4 py-3"
            placeholder="Enter your password"
            type="password"
          />
          <input
            className="mb-4 w-full rounded-md border px-4 py-3"
            placeholder="Confirm your password"
            type="password"
          />

          <div className="mb-5 text-sm">
            <input type="checkbox" className="mr-2" />I agree to the{" "}
            <a href="#" className="text-red-700">
              terms and conditions
            </a>
          </div>

          <button className="mb-5 w-full rounded-md bg-red-700 py-3 font-bold text-white">
            Register
          </button>

          <p className="text-center">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-red-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
