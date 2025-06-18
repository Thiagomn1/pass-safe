import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useVault } from "../../context/vault/useVault";
import { useState } from "react";
import api from "../../api/axios";
import { toast } from "sonner";

export function VaultUnlockDialog() {
  const { isUnlocked, unlockVault } = useVault();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = async () => {
    try {
      await api.post("/auth/unlock-vault", { password });
      unlockVault();
    } catch (error) {
      toast.error("Incorrect password. Please try again.");
      setError("Incorrect password. Try again.");
      console.error(error);
    }
  };

  if (isUnlocked) return null;

  return (
    <Dialog open>
      <DialogContent>
        <DialogTitle>Unlock Vault</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Enter your login password to view your saved passwords.
        </p>
        <Input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button className="mt-2 w-full" onClick={handleUnlock}>
          Unlock
        </Button>
      </DialogContent>
    </Dialog>
  );
}
