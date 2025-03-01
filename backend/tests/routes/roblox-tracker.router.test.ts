import request from "supertest";
import express, {Express} from "express";
import {RobloxTrackerRouter} from "../../src/api-server/roblox-tracker/router/roblox-tracker.router";
import {
  RobloxTracker,
  Routes,
} from "../../src/api-server/main-router/routes.enum";
import {
  ActiveUsersDTO,
  GamepassPurchaseDTO,
  PlayerDeathDTO,
  PlayerJoinDTO,
  PlayerLeaveDTO,
  ServerRestartDTO,
  ServerStatusDTO,
} from "../../src/api-server/roblox-tracker/interfaces";
import {
  DeviceTypeEnum,
  EventTypeEnum,
} from "../../src/api-server/roblox-tracker/enums";
import {MainRouter} from "../../src/api-server/main-router/main.router";
import {HttpExceptionHandlerService} from "../../src/api-server/exception-handling/http-exception-handler/http.exception-handler.service";

jest.mock("../../src/loggers/logger-service/logger.service", () => ({
  AppLogger: {
    getInstance: jest.fn(() => ({
      log: jest.fn(),
    })),
  },
}));

const app: Express = express();
app.use(express.json());

const mainRouter = new MainRouter(app);
mainRouter.init([new RobloxTrackerRouter().router]);

new HttpExceptionHandlerService(app).init();

describe("RobloxTrackerRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases: Array<{
    path: string;
    dto:
      | ServerRestartDTO
      | ServerStatusDTO
      | ActiveUsersDTO
      | PlayerJoinDTO
      | PlayerLeaveDTO
      | PlayerDeathDTO
      | GamepassPurchaseDTO;
  }> = [
    {
      path: `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.SERVER_RESTART}`,
      dto: {
        server_id: "server123",
        event_type: EventTypeEnum.SERVER_RESTART,
        data: {uptime: 31232, reason: "Update"},
      },
    },
    {
      path: `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.SERVER_STATUS}`,
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
      },
    },
    {
      path: `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.ACTIVE_USERS}`,
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
      },
    },
    {
      path: `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.PLAYER_JOIN}`,
      dto: {
        server_id: "server123",
        event_type: EventTypeEnum.PLAYER_JOIN,
        data: [{userid: 12345, name: "Player1", join_time: 1700000000}],
      },
    },
    {
      path: `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.PLAYER_LEAVE}`,
      dto: {
        server_id: "server123",
        event_type: EventTypeEnum.PLAYER_LEAVE,
        data: [{userid: 12345, name: "Player1", session_duration: 1200}],
      },
    },
    {
      path: `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.PLAYER_DEATH}`,
      dto: {
        server_id: "server123",
        event_type: EventTypeEnum.PLAYER_DEATH,
        data: [{userid: 12345, name: "Player1", death_cause: "fall"}],
      },
    },
    {
      path: `${Routes.V1}${Routes.ROBLOX}${RobloxTracker.GAMEPASS_PURCHASE}`,
      dto: {
        server_id: "server123",
        event_type: EventTypeEnum.GAMEPASS_PURCHASE,
        data: [{player: "Player1", pass_id: 456}],
      },
    },
  ];

  testCases.forEach(({path, dto}) => {
    it(`should return 200 for valid ${path} request`, async () => {
      const response = await request(app).post(path).send(dto);

      expect(response.status).toBe(200);
    });
  });

  it("should return 400 for invalid request", async () => {
    const response = await request(app)
      .post(`${Routes.V1}${Routes.ROBLOX}${RobloxTracker.SERVER_RESTART}`)
      .send({invalidField: "test"});

    console.log("Full response:", response.status, response.body);
    expect(response.status).toBe(400);
  });

  it("should return 500 when hitting the error trigger endpoint", async () => {
    const response = await request(app).get("/trigger-error");

    expect(response.status).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.error.message).toBe("Internal server error");
  });
});
