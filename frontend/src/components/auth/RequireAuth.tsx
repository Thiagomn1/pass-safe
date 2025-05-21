import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { IUser } from "../types/types";

type Props = {
  user?: IUser | null;
  children: JSX.Element;
};

function RequireAuth({ user, children }: Props) {
  const location = useLocation();

  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
