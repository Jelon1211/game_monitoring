import {AppLogger} from "../../../loggers/logger-service/logger.service";
import {MySqlDataSource} from "../sql-data-source";
import {SqlException} from "../../../exceptions/sql.exception";
import {ExceptionCodeEnum} from "../../../exceptions/exception-code.enum";
import {LoggerLevelEnum} from "../../../loggers/log-level/logger-level.enum";
import {ErrorLog} from "../../../loggers/error-log/error-log.instance";

export class TrackerModel {
  private static instance: TrackerModel | null = null;
  private readonly logger: AppLogger = AppLogger.getInstance();
  private readonly mySqlDataSource: MySqlDataSource =
    MySqlDataSource.getInstance();

  private constructor() {}

  public static getInstance() {
    if (TrackerModel.instance) {
      return TrackerModel.instance;
    }
    return (TrackerModel.instance = new TrackerModel());
  }
  public async getIntegrations(offset: number, limit: number): Promise<void> {
    try {
      const getIntegrationsQuery = `
            
        `;
      await this.mySqlDataSource.executeQuery(getIntegrationsQuery, [
        limit,
        offset,
      ]);
    } catch (err) {
      const error = new SqlException(
        "Failed while executing getIntegrations function",
        ExceptionCodeEnum.MYSQL_SERVICE__QUERY_ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
      throw error;
    }
  }
}
