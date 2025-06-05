import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useForm, type SubmitHandler } from "react-hook-form";

interface IUpdateFormInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit } = useForm<IUpdateFormInputs>();
  const [passwordCount, setPasswordCount] = useState(0);

  useEffect(() => {
    api
      .get("/passwords")
      .then((res) => setPasswordCount(res.data.length))
      .catch(() => toast.error("Failed to fetch passwords"));
  }, []);

  const handleUsernameUpdate: SubmitHandler<IUpdateFormInputs> = async (
    data
  ) => {
    try {
      const res = await api.patch("/auth/update", data);
      setUser(res.data.user);
      toast.success("Username updated successfuly.");
    } catch (error) {
      toast.error("Failed to update username, please try again.");
      console.error("Failed to update username: ", error);
    }
  };

  const handlePasswordUpdate: SubmitHandler<IUpdateFormInputs> = async (
    data
  ) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await api.patch("/auth/update", data);
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Password updated successfully. Redirecting..");
      setUser(null);
    } catch (error) {
      toast.error("Failed to update password. Please try again later.");
      console.error("Failed to update password: ", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Profile Summary</h2>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Saved Passwords:</strong> {passwordCount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-md font-semibold mb-2">Update Username</h3>
          <form
            onSubmit={handleSubmit(handleUsernameUpdate)}
            className="flex gap-2"
          >
            <Input
              {...register("username")}
              placeholder="New username"
              type="text"
            />
            <Button type="submit">Update</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-md font-semibold mb-2">Update Password</h3>
          <form
            onSubmit={handleSubmit(handlePasswordUpdate)}
            className="flex gap-2"
          >
            <Input
              {...register("password")}
              placeholder="Password"
              type="password"
            />
            <Input
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              type="password"
            />
            <Button type="submit">Update</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
