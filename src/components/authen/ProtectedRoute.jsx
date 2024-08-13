// components/ProtectedRoute.js

import { Navigate } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  // console.log("bruh 1 ", auth.isAuthenticated);

  if (!auth.isAuthenticated) {
    console.log("bruh 2 ", auth.isAuthenticated);

    return <Navigate to="/login" />;
  }

  // console.log("pass ", auth.isAuthenticated);

  return children;
};

export default ProtectedRoute;
