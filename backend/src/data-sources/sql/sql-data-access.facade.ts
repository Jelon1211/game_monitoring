import { MySqlDataSource } from "./sql-data-source";
import { AppLogger } from "../../loggers/logger-service/logger.service";

export class SqlDataAccessFacade {
  private static instance: SqlDataAccessFacade | null = null;
  private readonly logger: AppLogger = AppLogger.getInstance();
  private readonly mySqlDataSource: MySqlDataSource =
    MySqlDataSource.getInstance();

  private constructor() {}

  public static getInstance() {
    if (SqlDataAccessFacade.instance) {
      return SqlDataAccessFacade.instance;
    }
    return (SqlDataAccessFacade.instance = new SqlDataAccessFacade());
  }
}
