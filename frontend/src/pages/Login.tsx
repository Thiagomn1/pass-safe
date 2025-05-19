import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface ILoginFormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<ILoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    try {
      await api.post("/auth/login", data);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
