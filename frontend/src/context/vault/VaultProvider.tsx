import { useEffect, useState, type ReactNode } from "react";
import { VaultContext } from "./VaultContext";
import { toast } from "sonner";

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setIsUnlocked(false);
  }, []);

  const unlockVault = async (): Promise<boolean> => {
    try {
      setIsUnlocked(true);
      toast.success("Vault unlocked");
      return true;
    } catch (error) {
      toast.error("Failed to unlock vault. Check your password.");
      console.error(error);
    }
    return false;
  };

  const lockVault = () => {
    setIsUnlocked(false);
    toast.info("Vault locked");
  };

  return (
    <VaultContext.Provider value={{ isUnlocked, unlockVault, lockVault }}>
      {children}
    </VaultContext.Provider>
  );
};
