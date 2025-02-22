import {RedisDataAccessFacade} from "../../../data-sources/redis/redis-data-access-facade";
import {ExceptionCodeEnum} from "../../../exceptions/exception-code.enum";
import {TrackerException} from "../../../exceptions/tracker.exception";
import {ErrorLog} from "../../../loggers/error-log/error-log.instance";
import {LoggerLevelEnum} from "../../../loggers/log-level/logger-level.enum";
import {AppLogger} from "../../../loggers/logger-service/logger.service";
import {EventTypeEnum} from "../enums";
import {ActiveUsersDTO, ServerRestartDTO, ServerStatusDTO} from "../interfaces";

export class RobloxTrackerService {
  private readonly logger: AppLogger = AppLogger.getInstance();
  private readonly redisFacade: RedisDataAccessFacade =
    RedisDataAccessFacade.getInstance();

  public async cacheRobloxServerData(
    data: ServerRestartDTO | ServerStatusDTO | ActiveUsersDTO
  ): Promise<void> {
    try {
      const key = data.server_id;
      await this.redisFacade.trimList(key, 1000);
      await this.redisFacade.setExpiration(key, 86400);

      switch (data.event_type) {
        case EventTypeEnum.SERVER_RESTART:
          await this.cacheServerRestart(data as ServerRestartDTO);
          break;
        case EventTypeEnum.SERVER_STATUS:
          await this.cacheServerStatus(data as ServerStatusDTO);
          break;
        case EventTypeEnum.ACTIVE_USERS:
          await this.cacheActiveUsers(data as ActiveUsersDTO);
          break;
        default:
          break;
      }
    } catch (err) {
      const error = new TrackerException(
        `Error executing cacheEvents function`,
        ExceptionCodeEnum.TRACKER__ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
    }
  }

  private async cacheServerRestart(
    serverRestartData: ServerRestartDTO
  ): Promise<void> {
    try {
      await this.redisFacade.pushToList(
        `server_id:${serverRestartData.server_id}`,
        JSON.stringify({[serverRestartData.event_type]: serverRestartData.data})
      );
    } catch (err) {
      const error = new TrackerException(
        `Error executing cacheServerRestart function`,
        ExceptionCodeEnum.TRACKER__ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
    }
  }

  private async cacheServerStatus(serverStatusData: ServerStatusDTO) {
    try {
      await this.redisFacade.pushToList(
        `server_id:${serverStatusData.server_id}`,
        JSON.stringify({[serverStatusData.event_type]: serverStatusData.data})
      );
    } catch (err) {
      const error = new TrackerException(
        `Error executing cacheServerStatus function`,
        ExceptionCodeEnum.TRACKER__ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
    }
  }

  private async cacheActiveUsers(serverStatusData: ActiveUsersDTO) {
    try {
      await this.redisFacade.pushToList(
        `server_id:${serverStatusData.server_id}`,
        JSON.stringify({[serverStatusData.event_type]: serverStatusData.data})
      );
    } catch (err) {
      const error = new TrackerException(
        `Error executing cacheActiveUsers function`,
        ExceptionCodeEnum.TRACKER__ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
    }
  }
}
