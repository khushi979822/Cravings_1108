import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(
    JSON.parse(sessionStorage.getItem("cravingUser")) || null,
  );
  const [isLogin, setIsLogin] = useState(!!user);
  const [role, setRoleState] = useState(
    user?.userType || null,
  );

  useEffect(() => {
    setIsLogin(!!user);
    setRoleState(user?.userType || null);
  }, [user]);

  const setUser = (value) => {
    setUserState(value);
    if (value) {
      sessionStorage.setItem("cravingUser", JSON.stringify(value));
    } else {
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
