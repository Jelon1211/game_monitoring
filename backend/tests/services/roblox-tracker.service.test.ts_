import {EventTypeEnum} from "../../src/api-server/roblox-tracker/enums";
import {ServerRestartDTO} from "../../src/api-server/roblox-tracker/interfaces";
import {RobloxTrackerService} from "../../src/api-server/roblox-tracker/serivce/roblox-tracker.service";
import {RedisDataAccessFacade} from "../../src/data-sources/redis/redis-data-access-facade";
import {ErrorLog} from "../../src/loggers/error-log/error-log.instance";
import {LoggerLevelEnum} from "../../src/loggers/log-level/logger-level.enum";
import {AppLogger} from "../../src/loggers/logger-service/logger.service";

jest.mock("../../src/data-sources/redis/redis-data-access-facade");
jest.mock("../../src/loggers/logger-service/logger.service");

describe("RobloxTrackerService", () => {
  let service: RobloxTrackerService = new RobloxTrackerService();
  let redisMock: jest.Mocked<RedisDataAccessFacade> | null = null;
  let loggerMock: jest.Mocked<AppLogger> | null = null;

  beforeEach(() => {
    redisMock =
      RedisDataAccessFacade.getInstance() as jest.Mocked<RedisDataAccessFacade>;

    loggerMock = {log: jest.fn()} as unknown as jest.Mocked<AppLogger>;
    (AppLogger.getInstance as jest.Mock).mockReturnValue(loggerMock);

    (
      service as unknown as {redisFacade: jest.Mocked<RedisDataAccessFacade>}
    ).redisFacade = redisMock!;

    (service as unknown as {logger: jest.Mocked<AppLogger>}).logger =
      loggerMock!;
  });

  it("powinien poprawnie cachować restart serwera", async () => {
    const testData: ServerRestartDTO = {
      server_id: "123",
      event_type: EventTypeEnum.SERVER_RESTART,
      data: {
        uptime: "322",
        reason: "restart",
      },
    };

    await service.cacheRobloxServerData(testData);

    if (redisMock) {
      expect(redisMock.trimList("123", 1000)).toHaveBeenCalled();
      expect(redisMock.setExpiration("123", 86400)).toHaveBeenCalled();
      expect(
        redisMock.pushToList(
          `server_id:${testData.server_id}`,
          JSON.stringify({[testData.event_type]: testData.data})
        )
      ).toHaveBeenCalled();
    }
  });

  it("powinien logować błąd, jeśli operacja się nie powiedzie", async () => {
    if (redisMock) {
      redisMock.pushToList.mockRejectedValue(new Error("Redis error"));
    }

    const testData: ServerRestartDTO = {
      server_id: "123",
      event_type: EventTypeEnum.SERVER_RESTART,
      data: {
        uptime: "322",
        reason: "restart",
      },
    };

    await service.cacheRobloxServerData(testData);

    if (loggerMock) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(loggerMock.log).toHaveBeenCalledWith(
        LoggerLevelEnum.ERROR,
        expect.any(ErrorLog)
      );
    }
  });
});
