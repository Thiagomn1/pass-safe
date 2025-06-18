import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "../api/axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useVault } from "../context/vault/useVault";

interface ILoginFormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<ILoginFormInputs>();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { unlockVault } = useVault();

  useEffect(() => {
    if (user) {
      toast.info("Already logged in, redirecting...");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const loginMutation = useMutation({
    mutationFn: (data: ILoginFormInputs) => api.post("/auth/login", data),
    onSuccess: (res) => {
      setUser(res.data.user);
      toast.success("Successfully logged in. Redirecting...");
      unlockVault();
      navigate("/");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error("Login failed. Check your credentials and try again.");
        console.error("Login failed:", error.response?.data || error);
      } else {
        toast.error("An unknown error occurred during login.");
        console.error("Unexpected error:", error);
      }
    },
  });

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pt-4 flex flex-col items-center justify-center"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container flex flex-col items-center justify-center space-y-4"
      >
        <Input
          {...register("username")}
          placeholder="Username"
          type="text"
          className="w-full max-w-sm"
        />
        <Input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="w-full max-w-sm"
        />
        <Button
          type="submit"
          className="w-full max-w-sm cursor-pointer"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="pt-2 hover:text-blue-500 transition duration-150 cursor-pointer">
        New user?{" "}
        <Link to="/register" className="font-semibold">
          Create an account.
        </Link>
      </p>
    </motion.div>
  );
}
