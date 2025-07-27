import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const { role } = useAuth();
    if (role === "") return null;
    if (!role) return <Navigate to="/login" replace />;
    return children;
  };
  
  export default ProtectedRoute;