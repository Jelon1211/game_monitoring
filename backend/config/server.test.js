const config = (module.exports = {});

config.application = "game_monitoring";

config.expressApi = {
  bind: "0.0.0.0",
  port: 3000,
  authorizationToken: "dev-token",
  excludedPaths: [],
};

config.luxon = {
  timezone: "Europe/Warsaw",
};

config.winston = {
  console: {
    level: "info",
    handleExceptions: true,
    json: false,
    colorize: false,
  },
  sentry: {
    level: "error",
  },
  transports: {
    console: {
      enabled: true,
    },
    sentry: {
      enabled: true,
    },
  },
  exitOnError: false,
};

config.sentry = {
  tracing: {
    enabled: true,
    tracesSampleRate: 1,
    stripedTransactionTagList: [],
    skipTransactionEventList: ["GET /v1/check/ping", "GET /v1/check/telemetry"],
  },
  dsn: "",
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION_NUMBER,
};

config.mysqlRead = {
  id: "READ",
  connection: {
    connectionLimit: 10,
    host: "",
    timezone: "Europe/Warsaw",
    port: 3306,
    database: "",
    user: "",
    password: "",
    charset: "UTF8_GENERAL_CI",
  },
};

config.mysqlWrite = {
  id: "WRITE",
  connection: {
    connectionLimit: 10,
    host: "",
    timezone: "Europe/Warsaw",
    port: 3306,
    database: "",
    user: "",
    password: "",
    charset: "UTF8_GENERAL_CI",
  },
};

config.redis = {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
};

config.cron = {
  test: "32 * * * *",
};

config.jwt = {
  secret:
    "a5268d7c2c40ed0e4715chd38de5c23f9448ba0336b8b4ee94ba6a63ff5ae58a7ee45c32b570b4d4a7578325745791d98d6abfc7a2ee80c4043118304e643537",
};

module.exports = config;
