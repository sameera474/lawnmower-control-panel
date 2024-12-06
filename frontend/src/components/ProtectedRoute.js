import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// ProtectedRoute component checks if the user is authenticated (admin) before rendering the child components
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Redirect to admin login if no token is found
    return <Navigate to="/admin-login" state={{ from: location }} />;
  }

  return children; // Render the protected content (Admin Dashboard)
};

export default ProtectedRoute;
