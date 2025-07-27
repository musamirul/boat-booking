import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  // Load from localStorage on app start
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user_id");
    setRole(storedRole ? storedRole.toLowerCase().trim() : "");
    setUserId(storedUser || "");
  }, []);

  const login = (id, userRole) => {
    localStorage.setItem("user_id", id);
    localStorage.setItem("role", userRole);
    setUserId(id);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.clear();
    setUserId("");
    setRole("");
  };

  return (
    <AuthContext.Provider value={{ role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);