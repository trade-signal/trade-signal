import { Injectable, OnModuleInit } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { CronJob } from "cron";

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

  protected addCronJob(name: string, job: CronJob) {
    this.schedulerRegistry.addCronJob(name, job as any);
    job.start();
  }

  protected removeCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  protected getCronJob(name: string): CronJob {
    return this.schedulerRegistry.getCronJob(name) as unknown as CronJob;
  }

  protected getCronJobs() {
    return this.schedulerRegistry.getCronJobs() as unknown as Map<
      string,
      CronJob
    >;
  }
}
