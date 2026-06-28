import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left md:flex md:justify-between md:items-center gap-4">
        <div>
          <p className="text-lg font-semibold text-white">Cravings</p>
          <p className="text-sm mt-2">
            Fast food delivery for your everyday cravings.
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm mt-4 md:mt-0">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link to="/login" className="hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="hover:text-white transition-colors">
            Register
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 pt-4 border-t border-gray-700 text-center text-sm">
        <p>© 2026 Craving. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
