import {Router, Request, Response, NextFunction} from "express";
import {Routes, RobloxTracker} from "../../main-router/routes.enum";
import {HttpException} from "../../../exceptions/http.exception";
import {RobloxTrackerService} from "../serivce/roblox-tracker.service";
import {AppLogger} from "../../../loggers/logger-service/logger.service";
import {LoggerLevelEnum} from "../../../loggers/log-level/logger-level.enum";
import {ValidationMiddleware} from "../../../validation/middleware/validation.middleware";
import {ErrorLog} from "../../../loggers/error-log/error-log.instance";
import * as schemas from "../schema/tracker.schema";
import {CustomException} from "../../../exceptions/custom-exception.interface";

import {
  ActiveUsersDTO,
  GamepassPurchaseDTO,
  PlayerDeathDTO,
  PlayerJoinDTO,
  PlayerLeaveDTO,
  ServerRestartDTO,
  ServerStatusDTO,
} from "../interfaces";

export class RobloxTrackerRouter {
  private readonly integrationRouter = Router();
  private readonly robloxTrackerService = new RobloxTrackerService();
  private readonly logger: AppLogger = AppLogger.getInstance();

  private readonly endpoints = [
    {
      path: RobloxTracker.SERVER_RESTART,
      schema: schemas.serverRestartSchema,
      type: "ServerRestartDTO",
    },
    {
      path: RobloxTracker.SERVER_STATUS,
      schema: schemas.serverStatusSchema,
      type: "ServerStatusDTO",
    },
    {
      path: RobloxTracker.ACTIVE_USERS,
      schema: schemas.activeUsersSchema,
      type: "ActiveUsersDTO",
    },
    {
      path: RobloxTracker.PLAYER_JOIN,
      schema: schemas.playerJoinSchema,
      type: "PlayerJoinDTO",
    },
    {
      path: RobloxTracker.PLAYER_LEAVE,
      schema: schemas.playerLeaveSchema,
      type: "PlayerLeaveDTO",
    },
    {
      path: RobloxTracker.PLAYER_DEATH,
      schema: schemas.playerDeathSchema,
      type: "PlayerDeathDTO",
    },
    {
      path: RobloxTracker.GAMEPASS_PURCHASE,
      schema: schemas.gamepassPurchaseSchema,
      type: "GamepassPurchaseDTO",
    },
  ] as const;

  constructor() {
    this.registerEndpoints();
  }

  private registerEndpoints() {
    this.endpoints.forEach(({path, schema, type}) => {
      this.integrationRouter.post(
        `${Routes.V1}${Routes.ROBLOX}${path}`,
        ValidationMiddleware.validate(schema),
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            // eslint-disable-next-line init-declarations
            let data:
              | ServerRestartDTO
              | ServerStatusDTO
              | ActiveUsersDTO
              | PlayerJoinDTO
              | PlayerLeaveDTO
              | PlayerDeathDTO
              | GamepassPurchaseDTO;

            switch (type) {
              case "ServerRestartDTO":
                data = req.body as ServerRestartDTO;
                break;
              case "ServerStatusDTO":
                data = req.body as ServerStatusDTO;
                break;
              case "ActiveUsersDTO":
                data = req.body as ActiveUsersDTO;
                break;
              case "PlayerJoinDTO":
                data = req.body as PlayerJoinDTO;
                break;
              case "PlayerLeaveDTO":
                data = req.body as PlayerLeaveDTO;
                break;
              case "PlayerDeathDTO":
                data = req.body as PlayerDeathDTO;
                break;
              case "GamepassPurchaseDTO":
                data = req.body as GamepassPurchaseDTO;
                break;
              default:
                throw new HttpException("Invalid request type", 400);
            }

            res.status(200).end();
            await this.robloxTrackerService.cacheRobloxServerData(data);
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
    });
  }

  public get router(): Router {
    return this.integrationRouter;
  }
}
