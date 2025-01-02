import dayjs from "dayjs";

import prisma from "@/prisma/db";
import { BatchUpdate } from "@prisma/client";

const createBatch = async (data: Partial<BatchUpdate>) => {
  return prisma.batchUpdate.create({ data: data as any });
};

const updateBatch = async (id: string, data: Partial<BatchUpdate>) => {
  return prisma.batchUpdate.update({ where: { id }, data: data as any });
};

// 数据类型
export type BatchType =
  | "news"
  | "stock_base"
  | "stock_selection"
  | "stock_quotes"
  | "stock_quotes_daily"
  | "stock_index";

// 数据来源
export type BatchSource = "sina" | "cls" | "eastmoney";

// 批次状态类型
export type BatchStatus =
  | "pending"
  | "fetching"
  | "transforming"
  | "completed"
  | "failed";

export const initBatch = async (type: BatchType, source: BatchSource) => {
  return createBatch({
    type,
    source,
    batchTime: dayjs().toDate(),
    count: 0,
    status: "pending"
  });
};

export const updateBatchStatus = async (
  batchId: string,
  status: BatchStatus,
  count?: number
) => {
  await updateBatch(batchId, {
    status,
    ...(count !== undefined ? { count } : {})
  });
};
