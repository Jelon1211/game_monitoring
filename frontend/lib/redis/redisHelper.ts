import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../constants";

class RedisHelper {
  private client: Redis;

  constructor() {
    if (!REDIS_HOST || !REDIS_PORT) {
      throw new Error("Missing Redis environment variables.");
    }

    this.client = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
    });
  }

  async get<T>(key: string, isList = false): Promise<T | null> {
    if (isList) {
      const list = await this.client.lrange(key, 0, -1);
      return list.length ? (list.map((item) => JSON.parse(item)) as T) : null;
    } else {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    }
  }

  async searchKeys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  async search<T>(
    key: string,
    searchTerm: string,
    field: keyof T
  ): Promise<T[]> {
    const data = await this.get<T[]>(key);
    if (!data) return [];

    return data.filter((item) =>
      String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export const redisHelper = new RedisHelper();
