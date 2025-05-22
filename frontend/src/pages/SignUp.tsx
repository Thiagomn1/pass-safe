import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

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
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<IRegisterFormInputs> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast("Passwords do not match");
        return;
      }

      await api.post("/auth/register", data);
      const me = await api.get("/auth/me");
      setUser(me.data);
      navigate("/");
    } catch (error) {
      toast("Registration failed, please try again.");
      console.error("Register failed", error);
    }
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
        <Button type="submit" className="w-full max-w-sm cursor-pointer">
          Register
        </Button>
      </form>
    </motion.div>
  );
}
