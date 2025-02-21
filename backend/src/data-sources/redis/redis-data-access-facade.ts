import {RedisDataSource} from "./redis-data-source";

export class RedisDataAccessFacade {
  private static instance: RedisDataAccessFacade | null = null;
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

  public async pushToList(key: string, ...values: string[]): Promise<void> {
    await this.redisDataSource.lpush(key, ...values);
  }

  public async trimList(key: string, maxSize: number): Promise<void> {
    await this.redisDataSource.ltrim(key, 0, maxSize - 1);
  }

  public async setExpiration(key: string, ttl: number): Promise<void> {
    await this.redisDataSource.expire(key, ttl);
  }
}
