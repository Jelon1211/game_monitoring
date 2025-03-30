import { Pool, PoolClient } from "pg";
import {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} from "@/config/constants";

class PostgresHelper {
  private static instance: PostgresHelper;
  private pool: Pool;

  private constructor() {
    if (
      !POSTGRES_HOST ||
      !POSTGRES_DB ||
      !POSTGRES_USER ||
      !POSTGRES_PASSWORD ||
      !POSTGRES_PORT
    ) {
      throw new Error("Missing Postgres environment variables.");
    }

    this.pool = new Pool({
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    });
  }

  public static getInstance(): PostgresHelper {
    if (!PostgresHelper.instance) {
      PostgresHelper.instance = new PostgresHelper();
    }
    return PostgresHelper.instance;
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query<T>(text, params);
    return result.rows;
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async transaction<T = any>(
    fn: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.pool.query("SELECT 1");
      return true;
    } catch (error) {
      console.error("Postgres health check failed:", error);
      return false;
    }
  }

  async disconnect() {
    await this.pool.end();
  }
}

export const postgresHelper = PostgresHelper.getInstance();
