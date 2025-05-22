import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import type { IUser } from "../../types/types";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

type NavbarProps = {
  user?: IUser | null;
};

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast("Successfully logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="w-full border-b flex items-center justify-center">
      <div className="container flex items-center justify-between py-4">
        <Link
          to="/"
          className="text-xl font-semibold pl-4 hover:text-blue-500 transition duration-150"
        >
          PassSafe
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          {user ? (
            <Button
              className="cursor-pointer"
              onClick={handleLogout}
              variant="secondary"
            >
              Logout
            </Button>
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
