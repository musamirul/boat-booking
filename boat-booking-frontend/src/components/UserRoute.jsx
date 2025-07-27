import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

const UserRoute = ({ children }) => {
    const { role } = useAuth();
    if (role === "") return null;
    if (role !== "user") return <Navigate to="/" replace />;
    return children;
  };
  
  export default UserRoute;