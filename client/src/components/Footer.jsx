import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <p className="text-2xl font-extrabold text-white mb-3">🍽️ Cravings</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Fast, reliable food delivery for your everyday cravings. Fresh meals from the best local restaurants, delivered to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
            <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-orange-400 transition-colors">Register</Link></li>
          </ul>
        </div>

        {/* For Partners */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Partners</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-orange-400 transition-colors">Restaurant Partner</Link></li>
            <li><Link to="/register" className="hover:text-orange-400 transition-colors">Become a Rider</Link></li>
            <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get in Touch</p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📧 support@cravings.in</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© 2026 Cravings. All rights reserved.</p>
          <p className="text-xs">Made with ❤️ for food lovers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
