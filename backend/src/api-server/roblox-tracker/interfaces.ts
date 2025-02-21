import {EventTypeEnum} from "./enums";

export interface RobloxDTO<T> {
  server_id: string;
  event_type: EventTypeEnum;
  data: T;
}

interface ServerRestart {
  uptime: string;
  reason: string;
}

export type ServerRestartDTO = RobloxDTO<ServerRestart>;
