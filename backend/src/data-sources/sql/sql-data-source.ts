import {Pool, PoolClient, QueryResultRow} from "pg";
import {Config} from "../../config-builder/config.interface";
import ConfigBuilder from "../../config-builder/config-builder";
import {AppLogger} from "../../loggers/logger-service/logger.service";
import {LoggerLevelEnum} from "../../loggers/log-level/logger-level.enum";
import {SqlException} from "../../exceptions/sql.exception";
import {ExceptionCodeEnum} from "../../exceptions/exception-code.enum";
import {InfoLog} from "../../loggers/info-log/info-log.instance";
import {ErrorLog} from "../../loggers/error-log/error-log.instance";
import {CustomException} from "../../exceptions/custom-exception.interface";
import debug from "debug";

export class PostgresDataSource {
  private static instance: PostgresDataSource | null = null;
  private readonly config: Config = ConfigBuilder.getConfig().config;
  private readonly logger: AppLogger = AppLogger.getInstance();
  private readonly debug = debug("Postgres");
  private readonly readPool: Pool;
  private readonly writePool: Pool;

  private constructor() {
    if (!this.config.postgresRead || !this.config.postgresWrite) {
      const error = new SqlException(
        "Missing PostgreSQL configuration in config file.",
        ExceptionCodeEnum.MYSQL_SERVICE__CONN_ERR
      );
      this.logger.log(LoggerLevelEnum.ERROR, error);
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.readPool = new Pool(this.config.postgresRead.connection);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.writePool = new Pool(this.config.postgresWrite.connection);

    this.addPoolListeners(this.readPool, "read");
    this.addPoolListeners(this.writePool, "write");
  }

  public static getInstance(): PostgresDataSource {
    if (!PostgresDataSource.instance) {
      PostgresDataSource.instance = new PostgresDataSource();
    }
    return PostgresDataSource.instance;
  }

  private addPoolListeners(pool: Pool, label: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    pool.on("connect", (_client: PoolClient) => {
      this.debug(`New ${label} client connected.`);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    pool.on("error", (err) => {
      return this.logger.log(
        LoggerLevelEnum.ERROR,
        new ErrorLog(err as CustomException)
      );
    });
  }

  public async executeQuery<T extends QueryResultRow>(
    query: string,
    params: unknown[] = [],
    isWrite = false
  ): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = isWrite ? this.writePool : this.readPool;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const client = await pool.connect();
      try {
        this.debug(
          `Executing query: ${query} with params: ${JSON.stringify(params)}`
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const res = await client.query<T>(query, params);
        this.logger.log(
          LoggerLevelEnum.DEBUG,
          new InfoLog("Postgres query executed", {query})
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return res.rows as unknown as T;
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        client.release();
      }
    } catch (error) {
      this.logger.log(
        LoggerLevelEnum.ERROR,
        new ErrorLog(error as CustomException)
      );
      throw error;
    }
  }

  public async testConnections(): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.readPool.query("SELECT 1");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.writePool.query("SELECT 1");
      this.logger.log(
        LoggerLevelEnum.INFO,
        new InfoLog("All Postgres pools tested successfully.")
      );
    } catch (err) {
      const error = new SqlException(
        "Error while testing Postgres connections.",
        ExceptionCodeEnum.MYSQL_SERVICE__CONN_ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
      throw error;
    }
  }
}
