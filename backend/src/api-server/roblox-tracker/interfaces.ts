import {DeviceTypeEnum, EventTypeEnum} from "./enums";

export interface RobloxDTO<T> {
  server_id: string;
  event_type: EventTypeEnum;
  data: T;
}

interface ServerRestart {
  uptime: number;
  reason: string;
}
export type ServerRestartDTO = RobloxDTO<ServerRestart>;

interface ServerStatus {
  max_players: number;
  uptime: number;
  online_count: number;
  server_load: number;
  map_name: number;
}
export type ServerStatusDTO = RobloxDTO<ServerStatus[]>;

interface ActiveUsers {
  name: string;
  userid: number;
  position?: PlayerPosition;
  timestamp: number;
}
interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}
export type ActiveUsersDTO = RobloxDTO<ActiveUsers[]>;

interface PlayerJoin {
  userid: number;
  name: string;
  join_time: number;
}
export type PlayerJoinDTO = RobloxDTO<PlayerJoin[]>;

interface PlayerLeave {
  userid: number;
  name: string;
  session_duration: number;
}
export type PlayerLeaveDTO = RobloxDTO<PlayerLeave[]>;

interface PlayerDeath {
  userid: number;
  name: string;
  death_cause: string;
  position?: PlayerPosition;
}
export type PlayerDeathDTO = RobloxDTO<PlayerDeath[]>;

interface GamepassPurchase {
  player: string;
  pass_id: number;
}
export type GamepassPurchaseDTO = RobloxDTO<GamepassPurchase[]>;
