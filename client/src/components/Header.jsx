import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../images/craveing logo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-orange-700 px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="logo" className="h-12" />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-md px-4 py-2 text-white hover:bg-orange-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-md bg-white px-4 py-2 text-red-700 hover:bg-gray-100"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
