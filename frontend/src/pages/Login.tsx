import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "../api/axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface ILoginFormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<ILoginFormInputs>();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      toast("Already logged in, redirecting...");
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      setUser(res.data.user);
      toast("Successfully logged in. Redirecting...");
      navigate("/");
    } catch (error) {
      toast("Login failed. Check your credentials and try again.");
      console.error("Login failed", error);
    }
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
        <Button type="submit" className="w-full max-w-sm cursor-pointer">
          Login
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
