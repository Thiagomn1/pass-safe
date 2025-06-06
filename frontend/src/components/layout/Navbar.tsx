import { Link, useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import type { IUser } from "../../types/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";

type NavbarProps = {
  user?: IUser | null;
};

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      setUser(null);
      toast.success("Successfully logged out");
      navigate("/login");
    },
    onError: (error) => {
      toast.error("Logout failed. Please try again later.");
      console.error("Logout failed", error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="w-full border-b flex items-center justify-center">
      <div className="container flex items-center justify-between py-4">
        <Link
          to={user ? "/dashboard" : "/"}
          className="text-xl font-semibold pl-4 hover:text-blue-500 transition duration-150"
        >
          PassSafe
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          {user && (
            <Link
              to="/generate"
              className="text-sm font-medium hover:underline"
            >
              Generate
            </Link>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-medium border-black border-b-2 cursor-pointer"
                >
                  {user.username}
                  <ArrowDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default">
              <Link to="/login" className="text-sm font-medium hover:underline">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
