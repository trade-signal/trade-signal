import dayjs from "dayjs";

import prisma from "@/prisma/db";
import { SyncTask } from "@prisma/client";

const createTask = async (data: Partial<SyncTask>) => {
  return prisma.syncTask.create({ data: data as any });
};

const updateTask = async (id: string, data: Partial<SyncTask>) => {
  return prisma.syncTask.update({ where: { id }, data: data as any });
};

// 任务类型
export type TaskType =
  | "news"
  | "stock_base"
  | "stock_screener"
  | "stock_quotes"
  | "stock_minute_kline"
  | "stock_daily_kline"
  | "stock_index_quotes"
  | "stock_index_minute_kline"
  | "stock_index_daily_kline";

// 数据来源
export type TaskSource = "sina" | "cls" | "eastmoney";

// 任务状态类型
export type TaskStatus =
  | "pending"
  | "fetching"
  | "transforming"
  | "completed"
  | "failed";

export const initTask = async (type: TaskType, source: TaskSource) => {
  return createTask({
    taskType: type,
    dataSource: source,
    batchDate: dayjs().toDate(),
    priority: 2,
    status: "pending"
  });
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  count?: number
) => {
  await updateTask(taskId, {
    status,
    ...(count !== undefined ? { count } : {})
  });
};
