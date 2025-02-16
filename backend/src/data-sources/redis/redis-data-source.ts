import Redis from "ioredis";
import {Config} from "../../config-builder/config.interface";
import ConfigBuilder from "../../config-builder/config-builder";
import {AppLogger} from "../../loggers/logger-service/logger.service";
import {LoggerLevelEnum} from "../../loggers/log-level/logger-level.enum";
import {InfoLog} from "../../loggers/info-log/info-log.instance";
import {ErrorLog} from "../../loggers/error-log/error-log.instance";
import {RedisException} from "../../exceptions/redis.exception";
import {ExceptionCodeEnum} from "../../exceptions/exception-code.enum";

export class RedisDataSource {
  private static instance: RedisDataSource | null = null;
  private readonly config: Config = ConfigBuilder.getConfig().config;
  private readonly logger: AppLogger = AppLogger.getInstance();
  private redis: Redis;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): RedisDataSource {
    if (!RedisDataSource.instance) {
      RedisDataSource.instance = new RedisDataSource();
    }
    return RedisDataSource.instance;
  }

  private initialize(): void {
    const redisHost =
      process.env.REDIS_HOST || this.config.redis.connection.host;
    const redisPort =
      Number(process.env.REDIS_PORT) || this.config.redis.connection.port;

    this.redis = new Redis({
      host: redisHost,
      port: redisPort,
    });

    this.redis.on("connect", () => {
      this.logger.log(LoggerLevelEnum.INFO, new InfoLog("Connected to Redis"));
    });

    this.redis.on("error", (err) => {
      const error = new RedisException(
        "Missing Redis configuration in the config file.",
        ExceptionCodeEnum.REDIS_SERVICE__CONN_ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
    });
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.set(key, value, "EX", ttl);
      } else {
        await this.redis.set(key, value);
      }
      this.logger.log(LoggerLevelEnum.DEBUG, new InfoLog(`Redis set: ${key}`));
    } catch (error) {
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      const value = await this.redis.get(key);
      this.logger.log(LoggerLevelEnum.DEBUG, new InfoLog(`Redis get: ${key}`));
      return value;
    } catch (error) {
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
      return null;
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.log(
        LoggerLevelEnum.DEBUG,
        new InfoLog(`Redis delete: ${key}`)
      );
    } catch (error) {
      this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
    }
  }

  public async testConnections(): Promise<void> {
    try {
      await this.redis.ping();
      this.logger.log(
        LoggerLevelEnum.INFO,
        new InfoLog("Redis connection is healthy.")
      );
    } catch (err) {
      const error = new RedisException(
        "Redis connection in broken.",
        ExceptionCodeEnum.REDIS_SERVICE__CONN_ERR,
        {cause: err}
      );
      this.logger.log(LoggerLevelEnum.ERROR, error);
      throw error;
    }
  }
}
