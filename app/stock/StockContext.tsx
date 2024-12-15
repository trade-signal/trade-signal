"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  StockMarketValue,
  StockPeRatio,
  StockPriceRange
} from "./StockScreenerConfig";

export interface StockFilters {
  // 分页
  page?: number;
  pageSize?: number;

  // 行业
  industries?: string[];
  // 概念
  concepts?: string[];
  // 风格
  styles?: string[];

  // 价格
  newPrice?: StockPriceRange | null;
  // 总市值
  totalMarketValue?: StockMarketValue | null;
  // 市盈率
  peRatio?: StockPeRatio | null;

  // 搜索
  search?: string;
}

export interface StockContextType {
  filters: StockFilters;
  setFilters: (filters: StockFilters) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const getInitialPageSize = () => {
  if (typeof window !== "undefined" && window.innerHeight > 1000) return 30;
  return 20;
};

export const getInitialFilters = () => {
  return {
    page: 1,
    pageSize: getInitialPageSize(),
    industries: [],
    concepts: [],
    styles: [],
    newPrice: null,
    totalMarketValue: null,
    peRatio: null,
    search: ""
  };
};

export function StockProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<StockFilters>(getInitialFilters());

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
