import { Link, useNavigate } from "react-router-dom";
import logo from "../images/craveing logo.png";
import { useAuth } from "../context/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = () => {
  const { user, setUser, isLogin, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("UserData");
    setIsLogin(false);
    setUser(false);
    navigate("/");
  };
};
return (
  <Navbar className="h-15 flex items-center justify-between px-10 py-4 shadow-md bg-orange-700">
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
        <div className="border-s-2 flex justify-center items-center gap-4 px-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={user.photo}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <Link
            to={"/user/dashboard"}
            className="hover:underline hover:text-(--accent)"
          >
            {user.fullName}
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-red-600"
          >
            <AiOutlineLogout />
          </button>
        </div>
      ) : (
        <>
          <Link to={"/login"} className="hover:underline hover:text-(--accent)">
            Login
          </Link>
          <Link to={"/register"} className="hover:underline">
            Register
          </Link>
        </>
      )}
    </div>
  </Navbar>
);

export default Navbar;
