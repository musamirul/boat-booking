import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  // Load from localStorage on app start
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user_id");
    const storedName = localStorage.getItem("name");

    setRole(storedRole ? storedRole.toLowerCase().trim() : "");
    setUserId(storedUser || "");
    setUsername(storedName || "");
  }, []);

  // Login sets values and persists them
  const login = (id, userRole, name) => {
    localStorage.setItem("user_id", id);
    localStorage.setItem("role", userRole);
    localStorage.setItem("name", name);

    setUserId(id);
    setRole(userRole.toLowerCase().trim());
    setUsername(name);
  };

  const logout = () => {
    localStorage.clear();
    setUserId("");
    setRole("");
    setUsername("");
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        userId,
        username, // ✅ now matches state
        login,
        logout,
        user: username ? { username, userId, role } : null, // ✅ fixed user object
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);