import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import api from "../api/axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import passwordGenerator from "../lib/password-generator";
import { toast } from "sonner";
interface IGenerateFormInputs {
  password: string;
  site: string;
  length: number | null;
}

export default function Generate() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<IGenerateFormInputs>();

  const generatedPassword = watch("password");
  const site = watch("site");

  const generatePassword = (length: number = 16) => {
    const password = passwordGenerator(length);
    setValue("password", password);
  };

  const onSubmit: SubmitHandler<IGenerateFormInputs> = async (data) => {
    try {
      const { password, site } = data;

      const res = await api.post("/passwords", { password, site });
      console.log(res);
      toast(`Password for ${data.site} saved successfully!`);
      generatePassword(16);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Field validation failed:", error);
        toast("Field validation failed. Check console for more information");
      } else {
        console.error("Request failed:", error);
        toast("An unknown error occurred. Check console for more information");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pt-4 flex flex-col items-center justify-center"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">
        Generate new Password
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm mx-auto"
      >
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="16"
            className="w-20 text-center"
            {...register("length", { valueAsNumber: true, min: 4, max: 32 })}
          />
          <Input
            placeholder="Generate password"
            readOnly
            {...register("password")}
          />
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => generatePassword(watch("length") || 16)}
          >
            Generate
          </Button>
        </div>

        <Input
          placeholder="Enter site (e.g., netflix.com)"
          {...register("site", { required: true })}
        />

        <Button
          type="submit"
          className="cursor-pointer"
          disabled={!site || !generatedPassword || isSubmitting}
        >
          Save Password
        </Button>
      </form>
    </motion.div>
  );
}
