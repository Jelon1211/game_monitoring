import {Router, Request, Response, NextFunction} from "express";
import {Routes, RobloxTracker} from "../../main-router/routes.enum";
import {HttpException} from "../../../exceptions/http.exception";
import {RobloxTrackerService} from "../serivce/roblox-tracker.service";
import {AppLogger} from "../../../loggers/logger-service/logger.service";
import {LoggerLevelEnum} from "../../../loggers/log-level/logger-level.enum";
import {ValidationMiddleware} from "../../../validation/middleware/validation.middleware";
import {ErrorLog} from "../../../loggers/error-log/error-log.instance";
import {serverRestartSchema} from "../schema/tracker.schema";
import {ServerRestartDTO} from "../interfaces";
import {CustomException} from "../../../exceptions/custom-exception.interface";

export class RobloxTrackerRouter {
  private readonly integrationRouter = Router();
  private readonly robloxTrackerService = new RobloxTrackerService();
  private readonly logger: AppLogger = AppLogger.getInstance();

  constructor() {
    this.integrationRouter.post(
      `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.SERVER_RESTART}`,
      ValidationMiddleware.validate(serverRestartSchema),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const serverRestartData = req.body as ServerRestartDTO;
          res.status(200).end();
          await this.robloxTrackerService.cacheRobloxServerData(
            serverRestartData
          );
        } catch (err) {
          const error = new HttpException("Internal server error", 500, {
            cause: err,
          });
          this.logger.log(
            LoggerLevelEnum.ERROR,
            new ErrorLog(err as CustomException)
          );
          next(error);
        }
      }
    );
  }

  public get router(): Router {
    return this.integrationRouter;
  }
}
