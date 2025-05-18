export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
export const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE) || 5;
export const REDIS_HOST = process.env.REDIS_HOST || "redis";
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const POSTGRES_HOST = process.env.POSTGRES_HOST || "postgres";
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const POSTGRES_DB = process.env.POSTGRES_DB || "game_monitoring";
export const POSTGRES_USER = process.env.POSTGRES_USER || "admin";
export const POSTGRES_PASSWORD =
  process.env.POSTGRES_PASSWORD || "yourpassword";
