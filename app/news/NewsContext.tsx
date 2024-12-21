"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface NewsFilters {
  // 分页
  page?: number;
  pageSize?: number;

  // 来源
  source?: string;
  // 分类
  categories?: string[];
}

export interface NewsContextType {
  filters: NewsFilters;
  setFilters: (filters: NewsFilters) => void;
}

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined
);

const getInitialPageSize = () => {
  if (typeof window !== "undefined" && window.innerHeight > 1000) return 30;
  return 20;
};

export const getInitialFilters = () => {
  return {
    page: 1,
    pageSize: getInitialPageSize(),
    tags: []
  };
};

export function NewsProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<NewsFilters>(getInitialFilters());

  return (
    <NewsContext.Provider value={{ filters, setFilters }}>
      {children}
    </NewsContext.Provider>
  );
}

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};
