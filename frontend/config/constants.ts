export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
export const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE) || 5;
export const REDIS_HOST = process.env.REDIS_HOST || "redis";
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

