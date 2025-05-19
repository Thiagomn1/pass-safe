import { useForm } from "react-hook-form";
import api from "../api/axios";

export default function Generate() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await api.post("/generate", data);
    alert("Password generated!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("site")} placeholder="Site" />
      <input type="number" {...register("length")} placeholder="Length" />
      <button type="submit">Generate Password</button>
    </form>
  );
}
