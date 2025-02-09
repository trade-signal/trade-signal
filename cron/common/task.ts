import prisma from "@/prisma/db";
import { SyncTask } from "@prisma/client";
import dayjs from "dayjs";

// 任务类型
export type TaskType =
  | "news"
  | "stock_basic"
  | "stock_index_basic"
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

const createTask = async (data: Partial<SyncTask>) => {
  return prisma.syncTask.create({ data: data as any });
};

const updateTask = async (id: string, data: Partial<SyncTask>) => {
  return prisma.syncTask.update({ where: { id }, data: data as any });
};

export default class Task {
  private task!: SyncTask;

  constructor(
    private taskType: TaskType,
    private dataSource: TaskSource = "eastmoney",
    private batchDate: Date = dayjs().toDate(),
    private priority: number = 2,
    private status: TaskStatus = "pending"
  ) {}

  private async initialize() {
    this.task = await createTask({
      taskType: this.taskType,
      dataSource: this.dataSource,
      batchDate: this.batchDate,
      priority: this.priority,
      status: this.status
    });
  }

  async updateStatus(status: TaskStatus, totalCount?: number) {
    if (!this.task) {
      await this.initialize();
    }

    await updateTask(this.task.id, {
      status,
      ...(totalCount !== undefined ? { totalCount } : {})
    });
  }
}
