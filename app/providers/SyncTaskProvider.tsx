import { getRefetchInterval } from "@/shared/env";
import { clientGet } from "@/shared/request";
import { SyncTask } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

interface SyncTaskContextType {
  task: SyncTask[];
  isFetching: boolean;
  isLoading: boolean;
}

const SyncTaskContext = createContext<SyncTaskContextType | undefined>(
  undefined
);

const useSyncTask = () => {
  const [task, setTask] = useState<SyncTask[]>([]);

  const { isFetching, isLoading } = useQuery({
    queryKey: ["task"],
    queryFn: () => clientGet("/api/task", {}),
    refetchInterval: getRefetchInterval(),
    onSuccess: data => {
      setTask(data);
    }
  });

  return { task, isFetching, isLoading };
};

export const SyncTaskProvider = ({ children }: { children: ReactNode }) => {
  const { task, isFetching, isLoading } = useSyncTask();

  return (
    <SyncTaskContext.Provider value={{ task, isFetching, isLoading }}>
      {children}
    </SyncTaskContext.Provider>
  );
};

export const useSyncTaskContext = () => {
  const context = useContext(SyncTaskContext);
  if (!context) {
    throw new Error(
      "useSyncTaskContext must be used within a SyncTaskProvider"
    );
  }
  return context;
};
