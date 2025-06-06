import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

interface IUpdateFormInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

interface IPasswordData {
  site: string;
  password: string;
  id: string;
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit } = useForm<IUpdateFormInputs>();
  const [passwordCount, setPasswordCount] = useState(0);

  const { isLoading } = useQuery<IPasswordData[]>({
    queryKey: ["passwords"],
    queryFn: async () => {
      const res = await api.get("/passwords");
      setPasswordCount(res.data.length);
      return res.data;
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await api.patch("/auth/update", { username });
      return res.data.user;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Username updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update username, please try again.");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      await api.patch("/auth/update", { password });
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      setUser(null);
      toast.success("Password updated successfully. Redirecting...");
    },
    onError: () => {
      toast.error("Failed to update password. Please try again.");
    },
  });

  const handleUsernameUpdate: SubmitHandler<IUpdateFormInputs> = async (
    data
  ) => {
    if (!data.username) return toast.error("Username is required");
    updateUsernameMutation.mutate(data.username);
  };

  const handlePasswordUpdate: SubmitHandler<IUpdateFormInputs> = async (
    data
  ) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    updatePasswordMutation.mutate({ password: data.password });
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
            <strong>Saved Passwords:</strong>{" "}
            {isLoading ? "Fetching..." : passwordCount}
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
