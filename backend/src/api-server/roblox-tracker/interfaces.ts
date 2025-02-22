import {DeviceTypeEnum, EventTypeEnum} from "./enums";

export interface RobloxDTO<T> {
  server_id: string;
  event_type: EventTypeEnum;
  data: T;
}

interface ServerRestart {
  uptime: string;
  reason: string;
}
export type ServerRestartDTO = RobloxDTO<ServerRestart[]>;

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
  session_duration: number;
  user_id: number;
  join_time: number;
  position?: PlayerPosition;
  device_type: DeviceTypeEnum;
}
interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}
export type ActiveUsersDTO = RobloxDTO<ActiveUsers[]>;
