import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const { setUser } = useAuth();

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    try {
      await api.post("/auth/login", data);
      const me = await api.get("/auth/me");
      setUser(me.data);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className=" pt-4 flex flex-col items-center justify-center">
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
    </div>
  );
}
