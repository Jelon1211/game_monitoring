import {User} from "../../../config-builder/config.interface";
import {RedisDataAccessFacade} from "../../../data-sources/redis/redis-data-access-facade";
import {ExceptionCodeEnum} from "../../../exceptions/exception-code.enum";
import {TrackerException} from "../../../exceptions/tracker.exception";
import {ErrorLog} from "../../../loggers/error-log/error-log.instance";
import {LoggerLevelEnum} from "../../../loggers/log-level/logger-level.enum";
import {AppLogger} from "../../../loggers/logger-service/logger.service";
import {
  ActiveUsersDTO,
  GamepassPurchaseDTO,
  PlayerDeathDTO,
  PlayerJoinDTO,
  PlayerLeaveDTO,
  ServerRestartDTO,
  ServerStatusDTO,
} from "../interfaces";

type RobloxEventDTO =
  | ServerRestartDTO
  | ServerStatusDTO
  | ActiveUsersDTO
  | PlayerJoinDTO
  | PlayerLeaveDTO
  | PlayerDeathDTO
  | GamepassPurchaseDTO;

export class RobloxTrackerService {
  private readonly logger: AppLogger = AppLogger.getInstance();
  private readonly redisFacade: RedisDataAccessFacade =
    RedisDataAccessFacade.getInstance();
  private user: User | null = null;

  public async cacheRobloxServerData(
    data: RobloxEventDTO,
    serverUser: User
  ): Promise<void> {
    try {
      this.user = serverUser;
      const key = `server_id:${this.user.sub}`;
      await this.redisFacade.trimList(key, 1000);
      await this.redisFacade.setExpiration(key, 86400);
      await this.cacheEvent(data);
    } catch (err) {
      this.handleError("cacheRobloxServerData", err);
    }
  }

  private async cacheEvent(data: RobloxEventDTO): Promise<void> {
    try {
      if (!this.user) {
        const error = new TrackerException(
          `Error executing cacheEvent function`,
          ExceptionCodeEnum.TRACKER__ERR,
          {cause: "User not defined"}
        );
        this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
      }
      const key = `server_id:${this.user!.sub}`;
      const value = JSON.stringify({[data.event_type]: data.data});

      await this.redisFacade.pushToList(key, value);
    } catch (err) {
      this.handleError(`cacheEvent (${data.event_type})`, err);
    }
  }

  private handleError(method: string, err: unknown): void {
    const error = new TrackerException(
      `Error executing ${method} function`,
      ExceptionCodeEnum.TRACKER__ERR,
      {cause: err}
    );
    this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
  }
}
