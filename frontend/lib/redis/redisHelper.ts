import { REDIS_HOST, REDIS_PORT } from "@/config/constants";
import Redis from "ioredis";

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

  private tryParse<T>(value: string): T | string {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  async getType(key: string): Promise<string> {
    return await this.client.type(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(key: string): Promise<T | null> {
    const type = await this.getType(key);

    switch (type) {
      case "string": {
        const value = await this.client.get(key);
        return value ? (this.tryParse<T>(value) as T) : null;
      }

      case "list": {
        const list = await this.client.lrange(key, 0, -1);
        return list.map((item) => this.tryParse(item)) as T;
      }

      case "hash": {
        const hash = await this.client.hgetall(key);
        const parsed: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(hash)) {
          parsed[k] = this.tryParse(v);
        }
        return parsed as T;
      }

      case "zset": {
        const zset = await this.client.zrange(key, 0, -1, "WITHSCORES");
        const parsed: [string, number][] = [];
        for (let i = 0; i < zset.length; i += 2) {
          parsed.push([
            this.tryParse(zset[i]) as string,
            parseFloat(zset[i + 1]),
          ]);
        }
        return parsed as T;
      }

      case "none":
        return null;

      default:
        throw new Error(`Unsupported Redis type: ${type}`);
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
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) =>
      String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export const redisHelper = new RedisHelper();
