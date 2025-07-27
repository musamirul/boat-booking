import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const AdminRoute = ({ children }) => {
    const { role } = useAuth();
    if (role === "") return null;
    if (role !== "admin") return <Navigate to="/" replace />;
    return children;
  };
  
  export default AdminRoute;