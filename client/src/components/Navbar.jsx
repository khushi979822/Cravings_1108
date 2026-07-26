import { Link, useNavigate } from "react-router-dom";
import logo from "../images/craveing logo.png";
import { useAuth } from "../context/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";
import api from "../config/api.config.js";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (role === "restaurant") {
      navigate("/restaurant-dashboard");
    } else if (role === "rider") {
      navigate("/rider-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/customer-dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      toast.success(res.data.message);

      localStorage.removeItem("cravingUser");
      sessionStorage.removeItem("cravingUser");
      sessionStorage.removeItem("UserData");
      sessionStorage.removeItem("cravingRole");
      setUser(null);
      setIsLogin(false);
      setRole(null);
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during registration. Please try again.",
      );
    }
  };

  return (
    <nav className="h-15 flex items-center justify-between px-10 py-4 shadow-md bg-orange-700">
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

        {isLogin ? (
          <div className="border-l-2 flex items-center gap-4 pl-4">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={user?.photo.url}
                alt={user?.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={handleNavigate}
              className="text-white hover:underline"
            >
              {user?.fullName}
            </button>

            <button
              onClick={handleLogout}
              className="group flex items-center gap-1.5 border border-red-300 text-red-300 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              title="Logout"
            >
              <AiOutlineLogout className="text-base group-hover:rotate-12 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-white font-medium hover:text-orange-100 px-3 py-1.5 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-white text-orange-700 font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-50 transition-colors shadow-sm"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
