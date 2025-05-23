import { Injectable, OnModuleInit } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

@Injectable()
export abstract class ScheduledService implements OnModuleInit {
  protected readonly logger = new Logger(this.constructor.name);
  protected enableScheduled: boolean;

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly configService: ConfigService
  ) {
    this.enableScheduled = this.configService.get("scheduled.enabled");
  }

  protected abstract initialize(): Promise<void>;

  protected abstract initCronJob(): void;

  async onModuleInit() {
    await this.initialize();

    if (!this.enableScheduled) {
      this.logger.log("scheduled disabled, skip cron job");
      return;
    }

    this.logger.log("init cron job");

    this.initCronJob();
  }

  protected async addCronJob(name: string, job: CronJob) {
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  protected async removeCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  protected async getCronJob(name: string) {
    return this.schedulerRegistry.getCronJob(name);
  }

  protected async getCronJobs() {
    return this.schedulerRegistry.getCronJobs();
  }
}
