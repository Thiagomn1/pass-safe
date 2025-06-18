import { createContext } from "react";

interface VaultContextType {
  isUnlocked: boolean;
  unlockVault: () => Promise<boolean>;
  lockVault: () => void;
}

export const VaultContext = createContext<VaultContextType | undefined>(
  undefined
);
