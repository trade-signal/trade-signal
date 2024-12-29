import { createContext, useContext, useState, ReactNode } from "react";

interface ActiveStockContextType {
  activeStockCode: string | null;
  setActiveStockCode: (code: string | null) => void;
}

const ActiveStockContext = createContext<ActiveStockContextType | undefined>(
  undefined
);

export function ActiveStockProvider({ children }: { children: ReactNode }) {
  const [activeStockCode, setActiveStockCode] = useState<string | null>(null);

  return (
    <ActiveStockContext.Provider
      value={{ activeStockCode, setActiveStockCode }}
    >
      {children}
    </ActiveStockContext.Provider>
  );
}

export function useActiveStock() {
  const context = useContext(ActiveStockContext);
  if (context === undefined) {
    throw new Error(
      "useActiveStock must be used within an ActiveStockProvider"
    );
  }
  return context;
}
