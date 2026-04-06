import { Navigate } from "react-router-dom";
import { getAuth } from "../services/authStorage";

export default function RequireAuth({ roles = [], children }) {
  const auth = getAuth();
  
  console.log("RequireAuth - roles:", roles);
  console.log("RequireAuth - auth:", auth);
  
  // TEMPORARY: Allow test token for dashboard testing
  const hasTestToken = localStorage.getItem('privyprint_test_token') || window.location.search.includes('test=true');
  console.log("RequireAuth - hasTestToken:", hasTestToken);
  
  if (!auth?.token && !hasTestToken) {
    console.log("RequireAuth - No token found, redirecting...");
    // Redirect based on the intended role.
    const redirectTo = roles.includes("admin") ? "/admin/login" : "/login";
    console.log("RequireAuth - Redirecting to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  if (roles.length > 0 && !roles.includes(auth?.user?.role) && !hasTestToken) {
    console.log("RequireAuth - Role mismatch, redirecting...");
    console.log("RequireAuth - Required roles:", roles);
    console.log("RequireAuth - User role:", auth?.user?.role);
    
    // If user is admin but trying to access customer routes, redirect to admin login
    // If user is customer but trying to access admin routes, redirect to customer login
    const redirectTo = auth?.user?.role === "admin" ? "/admin/login" : "/login";
    console.log("RequireAuth - Role mismatch redirecting to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log("RequireAuth - Authentication successful, rendering children");
  return children;
}

