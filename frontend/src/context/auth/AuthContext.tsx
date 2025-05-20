import { createContext } from "react";
import type { IUser } from "../../types/types";

interface AuthContextType {
  user?: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
