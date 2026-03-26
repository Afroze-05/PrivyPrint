import { Navigate } from "react-router-dom";
import { getAuth } from "../services/authStorage";

export default function RequireAuth({ roles = [], children }) {
  const auth = getAuth();
  if (!auth?.token) {
    // Redirect based on the intended role.
    const redirectTo = roles.includes("admin") ? "/admin/login" : "/signup";
    return <Navigate to={redirectTo} replace />;
  }

  if (roles.length > 0 && !roles.includes(auth.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

