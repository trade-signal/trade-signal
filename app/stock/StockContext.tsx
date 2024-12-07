"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface StockFilters {
  startDate?: string;
  endDate?: string;
  industry?: string;
}

interface StockContextType {
  filters: StockFilters;
  setFilters: (filters: StockFilters) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<StockFilters>({
    industry: "全部行业"
  });

  return (
    <StockContext.Provider value={{ filters, setFilters }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStockContext() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error("useStockContext must be used within a StockProvider");
  }
  return context;
}
