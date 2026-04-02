import { Navigate } from "react-router-dom";
import { getAuth } from "../services/authStorage";

export default function RequireAuth({ roles = [], children }) {
  // TEMPORARY: Bypass authentication for dashboard testing
  return children;
  
  const auth = getAuth();
  
  // TEMPORARY: Allow test token for dashboard testing
  const hasTestToken = localStorage.getItem('privyprint_test_token') || window.location.search.includes('test=true');
  
  if (!auth?.token && !hasTestToken) {
    // Redirect based on the intended role.
    const redirectTo = roles.includes("admin") ? "/admin/login" : "/signup";
    return <Navigate to={redirectTo} replace />;
  }

  if (roles.length > 0 && !roles.includes(auth.role) && !hasTestToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

