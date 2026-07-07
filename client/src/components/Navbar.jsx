import { Link, useNavigate } from "react-router-dom";
import logo from "../images/craveing logo.png";
import { useAuth } from "../context/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";
import api from "../config/api.config.js";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, setUser, isLogin, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      sessionStorage.removeItem("UserData");
      setIsLogin(false);
      setUser(false);
      navigate("/");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response.status + " | " + error.response?.data?.message ||
          error.message,
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

            <Link to="/user/dashboard" className="text-white hover:underline">
              {user?.fullName}
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-300 hover:text-red-600 text-xl"
            >
              <AiOutlineLogout />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>

            <Link to="/register" className="text-white hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
