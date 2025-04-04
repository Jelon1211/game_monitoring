const config = (module.exports = {});

config.application = "game_monitoring";

config.expressApi = {
  bind: "",
  port: null,
  authorizationToken: "",
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
    timezone: "Z",
    port: null,
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
    timezone: "Z",
    port: null,
    database: "",
    user: "",
    password: "",
    charset: "UTF8_GENERAL_CI",
  },
};

config.cron = {
  test: "",
};

config.secret = {
  jwt: "",
};

config.allowedOrigins = [];

module.exports = config;
