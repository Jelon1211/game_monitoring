import {Router, Request, Response, NextFunction} from "express";
import {Routes, Tracker} from "../../main-router/routes.enum";
import {HttpException} from "../../../exceptions/http.exception";
import {TrackerService} from "../serivce/tracker.service";

import {AppLogger} from "../../../loggers/logger-service/logger.service";
import {LoggerLevelEnum} from "../../../loggers/log-level/logger-level.enum";
import {ValidationMiddleware} from "../../../validation/middleware/validation.middleware";
import {ErrorLog} from "../../../loggers/error-log/error-log.instance";
import {monitorPlayersSchema} from "../schema/tracker.schema";

export class TrackerRouter {
  private readonly integrationRouter = Router();
  private readonly trackerService = new TrackerService();
  private readonly logger: AppLogger = AppLogger.getInstance();

  constructor() {
    this.integrationRouter.post(
      `${Routes.V1}${Tracker.BASIC}`,
      //   ValidationMiddleware.validate(monitorPlayersSchema),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          console.log(JSON.stringify(req.body));
          res.status(200).send(req.body);
        } catch (err) {
          const error = new HttpException("Internal server error", 500, {
            cause: err,
          });
          this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(err));
          next(error);
        }
      }
    );
  }

  public get router(): Router {
    return this.integrationRouter;
  }
}
