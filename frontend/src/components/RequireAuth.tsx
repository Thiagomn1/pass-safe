import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ user, children }: { user: any; children: JSX.Element }) {
  const location = useLocation();

  if (user === null) {
    // Redirect to login, but keep the current location so you can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
