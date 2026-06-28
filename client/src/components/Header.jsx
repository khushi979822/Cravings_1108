import { Link } from "react-router-dom";
import logo from "../images/craveing logo.png";

function Header() {
  return (
    <header className="h-15 flex items-center justify-between px-10 py-4 shadow-md bg-orange-700">
      <Link to="/" aria-label="Go to home">
        <img
          src={logo}
          alt="Craving"
          className="h-12 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
        />
      </Link>

      <div className="flex items-center gap-4 flex-wrap justify-end">
        <Link
          to="/"
          className="text-white font-medium hover:text-orange-100 transition-colors"
        >
          Home
        </Link>

        <Link
          to="/contact"
          className="text-white font-medium hover:text-orange-100 transition-colors"
        >
          Contact Us
        </Link>

        <Link
          to="/login"
          className="text-white font-medium hover:text-orange-100 transition-colors"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-white text-orange-600 px-5 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
        >
          Register
        </Link>
      </div>
    </header>
  );
}

export default Header;
