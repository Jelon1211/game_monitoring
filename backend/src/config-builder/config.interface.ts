interface ExpressApi {
  bind: string;
  port: number;
  authorizationToken: string;
  passphrase: string;
  pathKey: string;
  pathCert: string;
}

interface Luxon {
  timezone: string;
}

interface WinstonConsole {
  level: string;
  handleExceptions: boolean;
  json: boolean;
  colorize: boolean;
}

interface WinstonSentry {
  level: string;
}

interface WinstonTransports {
  console: {
    enabled: boolean;
  };
  sentry: {
    enabled: boolean;
  };
}

interface Winston {
  console: WinstonConsole;
  sentry: WinstonSentry;
  transports: WinstonTransports;
  exitOnError: boolean;
}

export interface ConfigSentry {
  tracing: {
    enabled: boolean;
    tracesSampleRate: number;
    stripedTransactionTagList: string[];
    skipTransactionEventList: string[];
  };
  dsn: string;
  environment: string;
  release: string;
}

export enum ConnectionTypeId {
  READ = "READ",
  WRITE = "WRITE",
}

// export
export interface MySqlConnection {
  connectionLimit: number;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  charset: string;
  timezone?: string;
}

export interface ConfiguredPool {
  id: ConnectionTypeId;
  connection: MySqlConnection;
}

interface Tls {
  ciphers: string;
  honorCipherOrder: boolean;
  secureProtocol: string;
}

interface Notify {
  address: string;
  route: string;
  alg: string;
  token: string;
}

interface Cron {
  test: string;
}

interface TimeInterval {
  refund: number;
  abandonedTransaction: number;
}

export interface Config {
  application: string;
  expressApi: ExpressApi;
  luxon: Luxon;
  winston: Winston;
  sentry: ConfigSentry;
  mysqlRead: ConfiguredPool;
  mysqlWrite: ConfiguredPool;
  tls: Tls;
  notificationConsumer: Notify;
  cron: Cron;
  timeInterval: TimeInterval;
  jwt: Jwt;
  redis: RedisConnection;
}

interface RedisConnection {
  connection: {
    host: string;
    port: number;
  };
}

interface Jwt {
  secret: string;
}

export interface Merchant {
  uuid: string;
  company_id: string;
  user_id: string;
}
