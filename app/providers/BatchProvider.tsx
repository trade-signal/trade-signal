import { getRefetchInterval } from "@/shared/env";
import { clientGet, get } from "@/shared/request";
import { BatchUpdate } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

interface BatchContextType {
  batch: BatchUpdate[];
  isFetching: boolean;
  isLoading: boolean;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

const useBatch = () => {
  const [batch, setBatch] = useState<BatchUpdate[]>([]);

  const { isFetching, isLoading } = useQuery({
    queryKey: ["batch"],
    queryFn: () => clientGet("/api/batch", {}),
    refetchInterval: getRefetchInterval(),
    onSuccess: data => {
      setBatch(data);
    }
  });

  return { batch, isFetching, isLoading };
};

export const BatchProvider = ({ children }: { children: ReactNode }) => {
  const { batch, isFetching, isLoading } = useBatch();

  return (
    <BatchContext.Provider value={{ batch, isFetching, isLoading }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatchContext = () => {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error("useBatchContext must be used within a BatchProvider");
  }
  return context;
};
