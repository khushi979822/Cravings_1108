import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const getUserFromStorage = () => {
  try {
    const local = localStorage.getItem("cravingUser");
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem("cravingUser");
    if (session) return JSON.parse(session);
  } catch (e) {
    console.error("Failed to parse user from storage", e);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUserFromStorage);
  const [isLogin, setIsLogin] = useState(!!user);
  const [role, setRoleState] = useState(user?.userType || null);

  useEffect(() => {
    setIsLogin(!!user);
    setRoleState(user?.userType || null);
  }, [user]);

  const setUser = (value, remember = false) => {
    setUserState(value);
    if (value) {
      const shouldRemember = remember || !!localStorage.getItem("cravingUser");
      if (shouldRemember) {
        localStorage.setItem("cravingUser", JSON.stringify(value));
        sessionStorage.removeItem("cravingUser");
      } else {
        sessionStorage.setItem("cravingUser", JSON.stringify(value));
        localStorage.removeItem("cravingUser");
      }
    } else {
      localStorage.removeItem("cravingUser");
      sessionStorage.removeItem("cravingUser");
    }
  };

  const setRole = (value) => {
    setRoleState(value);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLogin, setIsLogin, role, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
