import { useForm, type SubmitHandler } from "react-hook-form";
import api from "../api/axios";

interface IFormInputs {
  site: string;
  length: number;
}

export default function Generate() {
  const { register, handleSubmit } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data: IFormInputs) => {
    const payload = {
      ...data,
      length: Number(data.length),
    };

    await api.post("/passwords", payload);
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
