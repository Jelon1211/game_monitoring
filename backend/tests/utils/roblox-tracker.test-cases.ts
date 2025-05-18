import {
  DeviceTypeEnum,
  EventTypeEnum,
} from "../../src/api-server/roblox-tracker/enums";
import {
  ActiveUsersDTO,
  GamepassPurchaseDTO,
  PlayerDeathDTO,
  PlayerJoinDTO,
  PlayerLeaveDTO,
  ServerRestartDTO,
  ServerStatusDTO,
} from "../../src/api-server/roblox-tracker/interfaces";

const testCases = [
  {
    dto: {
      server_id: "server123",
      event_type: EventTypeEnum.SERVER_RESTART,
      data: {uptime: 31232, reason: "Update"},
    } as ServerRestartDTO,
  },
  {
    dto: {
      server_id: "server123",
      event_type: EventTypeEnum.SERVER_STATUS,
      data: [
        {
          max_players: 100,
          uptime: 3600,
          online_count: 50,
          server_load: 0.8,
          map_name: 5125312,
        },
      ],
    } as ServerStatusDTO,
  },
  {
    dto: {
      server_id: "server123",
      event_type: EventTypeEnum.ACTIVE_USERS,
      data: [
        {
          name: "Player1",
          session_duration: 1200,
          userid: 12345,
          join_time: 1700000000,
          device_type: DeviceTypeEnum.PC,
        },
      ],
    } as ActiveUsersDTO,
  },
  {
    dto: {
      server_id: "server123",
      event_type: EventTypeEnum.PLAYER_JOIN,
      data: [{userid: 12345, name: "Player1", join_time: 1700000000}],
    } as PlayerJoinDTO,
  },
  {
    dto: {
      server_id: "server123",
      event_type: EventTypeEnum.PLAYER_LEAVE,
      data: [{userid: 12345, name: "Player1", session_duration: 1200}],
    } as PlayerLeaveDTO,
  },
  {
    dto: {
      server_id: "server123",
      event_type: EventTypeEnum.PLAYER_DEATH,
      data: [{userid: 12345, name: "Player1", death_cause: "fall"}],
    } as PlayerDeathDTO,
  },
  {
    dto: {
      server_id: "server123",
      event_type: EventTypeEnum.GAMEPASS_PURCHASE,
      data: [{player: "Player1", pass_id: 456}],
    } as GamepassPurchaseDTO,
  },
];

export default testCases;
