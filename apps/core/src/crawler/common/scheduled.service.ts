import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

@Injectable()
export abstract class ScheduledService {
  protected abstract logger: Logger;
  protected enableScheduled: boolean;

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly configService: ConfigService
  ) {
    this.enableScheduled = this.configService.get("scheduled.enabled");
  }

  async onModuleInit() {
    if (!this.enableScheduled) {
      this.logger.log("scheduled disabled, skip cron job");
      return;
    }

    this.initialize();

    this.logger.log("init cron job");

    this.initCronJob();
  }

  protected abstract initialize(): void;

  protected abstract initCronJob(): void;

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
