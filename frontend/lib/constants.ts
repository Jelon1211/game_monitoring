export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NextAdmin2";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "An modern dashboard built with Next.js 15, Postgres, Shadcn";
export const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE) || 5;
export const REDIS_HOST = process.env.REDIS_HOST || "redis";
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const NODE_ENV = process.env.NODE_ENV || "development";
