import {AppLogger} from "../../loggers/logger-service/logger.service";
import {RedisDataSource} from "./redis-data-source";

export class RedisDataAccessFacade {
  private static instance: RedisDataAccessFacade | null = null;
  private readonly logger: AppLogger = AppLogger.getInstance();
  private readonly redisDataSource: RedisDataSource =
    RedisDataSource.getInstance();

  private constructor() {}

  public static getInstance() {
    if (RedisDataAccessFacade.instance) {
      return RedisDataAccessFacade.instance;
    }
    return (RedisDataAccessFacade.instance = new RedisDataAccessFacade());
  }

  public async setCache(
    key: string,
    value: string,
    ttl?: number
  ): Promise<void> {
    const setValue = await this.redisDataSource.set(key, value, ttl);
    return setValue;
  }

  public async getCache(key: string): Promise<string | null> {
    const getValue = await this.redisDataSource.get(key);
    return getValue;
  }

  public async deleteCache(key: string): Promise<void> {
    const deleteValue = await this.redisDataSource.delete(key);
    return deleteValue;
  }
}
