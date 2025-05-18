import {Config} from "../../config-builder/config.interface";
import ConfigBuilder from "../../config-builder/config-builder";
import {AppLogger} from "../../loggers/logger-service/logger.service";
import {CronJob} from "cron";
import {LoggerLevelEnum} from "../../loggers/log-level/logger-level.enum";
import {ErrorLog} from "../../loggers/error-log/error-log.instance";
import {CronTaskException} from "../../exceptions/cron-task.exception";
import {ExceptionCodeEnum} from "../../exceptions/exception-code.enum";
import {InfoLog} from "../../loggers/info-log/info-log.instance";

export class TestJob {
  private readonly config: Config = ConfigBuilder.getConfig().config;
  private readonly logger: AppLogger = AppLogger.getInstance();
  private readonly cronTime: string = this.config.cron.test;
  private readonly timeZone: string = this.config.luxon.timezone;

  constructor() {}

  public getCroneJob() {
    return new CronJob(
      this.cronTime,
      () => {
        this.taskRun();
      },
      null,
      false,
      this.timeZone
    );
  }

  private taskRun() {
    try {
      this.logger.log(LoggerLevelEnum.INFO, new InfoLog("test job ran"));
    } catch (err) {
      const error = new CronTaskException(
        "Cannot proceed a whole task for TestJob",
        ExceptionCodeEnum.CRON_TASK__GENERAL_PROCEEDING_ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
      // SHOULD BE NOT THROWN, JUST LOG TO SENTRY
    }
  }
}
