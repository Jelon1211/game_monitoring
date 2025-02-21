import express, {Express} from "express";
import {getAppDetails} from "./api-server/app-details/get-app-details";
import {assignProcessEnvs} from "./api-server/app-details/assign-process-envs";
import {Morgan} from "./loggers/morgan/morgan";
import ConfigBuilder from "./config-builder/config-builder";
import {Config} from "./config-builder/config.interface";
import {AppLogger} from "./loggers/logger-service/logger.service";
import {ErrorLog} from "./loggers/error-log/error-log.instance";
import {InfoLog} from "./loggers/info-log/info-log.instance";
import {LoggerLevelEnum} from "./loggers/log-level/logger-level.enum";
import {ApplicationException} from "./exceptions/application.exception";
import {ExceptionCodeEnum} from "./exceptions/exception-code.enum";
import {SecurityHelpers} from "./api-server/security-helpers/security.helpers";
import {Routes} from "./api-server/main-router/routes.enum";
import {CheckRouter} from "./api-server/health-check/router/check.router";
import {MainRouter} from "./api-server/main-router/main.router";
import {NotFoundRouter} from "./api-server/exception-handling/not-found/not-found.router";
import {AuthMiddleware} from "./api-server/auth/auth.middleware";
import {HttpExceptionHandlerService} from "./api-server/exception-handling/http-exception-handler/http.exception-handler.service";
import {CronJobsWrapperService} from "./cron/cron-jobs-wrapper.service";
import {AppSentry} from "./loggers/sentry/sentry";
// import {MySqlDataSource} from "./data-sources/sql/sql-data-source";
import {RobloxTrackerRouter} from "./api-server/roblox-tracker/router/roblox-tracker.router";
import {TestJob} from "./cron/crone-jobs/test.job";
import {RedisDataSource} from "./data-sources/redis/redis-data-source";

assignProcessEnvs(__dirname);

class Server {
  private readonly config: Config = ConfigBuilder.getConfig().config;
  private readonly app: Express = express();
  private readonly appSentry: AppSentry = AppSentry.getInstance(this.app);
  private readonly logger: AppLogger = AppLogger.getInstance(this.appSentry);
  private readonly morgan: Morgan = new Morgan(
    this.app,
    this.logger.expressStream
  );
  private readonly securityHelpers: SecurityHelpers = new SecurityHelpers(
    this.app
  );
  private authMiddleware: AuthMiddleware = new AuthMiddleware(this.app);

  private mainRouter: MainRouter = new MainRouter(this.app);
  private httpExceptionHandler: HttpExceptionHandlerService =
    new HttpExceptionHandlerService(this.app);
  private readonly redisDataSource: RedisDataSource =
    RedisDataSource.getInstance();

  private readonly croneJobsWrapper: CronJobsWrapperService =
    new CronJobsWrapperService([new TestJob().getCroneJob()]);

  public async start(): Promise<void> {
    try {
      this.logger.log(
        LoggerLevelEnum.INFO,
        new InfoLog("Application run details.", getAppDetails(__filename))
      );
      this.morgan.init([Routes.V1 + Routes.CHECK + Routes.PING]);

      this.app.use(express.json());

      this.app.use(express.urlencoded({extended: true}));

      this.securityHelpers.setSecureHeaders();
      this.securityHelpers.initSecureHeadersMiddleware();

      this.authMiddleware.init({
        excludedRoutes: [],
      });

      this.mainRouter.init([
        new CheckRouter().router,
        new RobloxTrackerRouter().router,
        new NotFoundRouter().router,
      ]);

      this.httpExceptionHandler.init();

      await this.redisDataSource.testConnections();

      this.croneJobsWrapper.startAll();

      this.app.listen(this.config.expressApi.port, () => {
        this.logger.log(
          LoggerLevelEnum.INFO,
          new InfoLog(
            `API endpoint started at ${this.config.expressApi.bind}:${this.config.expressApi.port}`
          )
        );
      });
    } catch (err) {
      const error = new ApplicationException(
        "Error starting API",
        ExceptionCodeEnum.EXPRESS_APP__START_ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
      throw error;
    }
  }
}

const server = new Server();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(() => server.start())();
