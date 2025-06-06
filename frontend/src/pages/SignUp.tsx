import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface IRegisterFormInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const { register, handleSubmit } = useForm<IRegisterFormInputs>();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const signUpMutation = useMutation({
    mutationFn: (data: IRegisterFormInputs) => api.post("/auth/signup", data),
    onSuccess: (res) => {
      setUser(res.data.user);
      toast.success("Successfully registered. Redirecting...");
      navigate("/");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error("Registration failed. Check your input and try again.");
        console.error("Registration failed:", error.response?.data || error);
      } else {
        toast.error("An unknown error occurred during login.");
        console.error("Unexpected error:", error);
      }
    },
  });

  const onSubmit: SubmitHandler<IRegisterFormInputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await signUpMutation.mutateAsync(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pt-4 flex flex-col items-center justify-center"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Sign up</h2>
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
        <Input
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          type="password"
          className="w-full max-w-sm"
        />
        <Button
          type="submit"
          className="w-full max-w-sm cursor-pointer"
          disabled={signUpMutation.isPending}
        >
          {signUpMutation.isPending ? "Registering..." : "Register"}
        </Button>
      </form>
    </motion.div>
  );
}
