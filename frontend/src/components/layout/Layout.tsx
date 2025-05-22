import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import type { IUser } from "../../types/types";

type LayoutProps = {
  user?: IUser | null;
};

export default function Layout({ user }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-100">
      <Navbar user={user} />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
