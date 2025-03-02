import {createLoggerMock} from "../../mocks/logger.mock";
import {EventTypeEnum} from "../../../src/api-server/roblox-tracker/enums";
import {RobloxTrackerService} from "../../../src/api-server/roblox-tracker/serivce/roblox-tracker.service";
import {ErrorLog} from "../../../src/loggers/error-log/error-log.instance";
import {LoggerLevelEnum} from "../../../src/loggers/log-level/logger-level.enum";
import {createRedisMock} from "../../mocks/redis.mock";
import testCases from "../../utils/roblox-tracker.test-cases";

describe("RobloxTrackerService", () => {
  let service: RobloxTrackerService = new RobloxTrackerService();
  // eslint-disable-next-line init-declarations
  let redisMock: ReturnType<typeof createRedisMock>;
  // eslint-disable-next-line init-declarations
  let loggerMock: ReturnType<typeof createLoggerMock>;

  beforeEach(() => {
    redisMock = createRedisMock();
    loggerMock = createLoggerMock();

    service = new RobloxTrackerService();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (service as any).redisFacade = redisMock;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (service as any).logger = loggerMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({dto}) => {
    it(`should cache event: ${dto.event_type}`, async () => {
      await service.cacheRobloxServerData(dto);

      if (redisMock) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(redisMock.trimList).toHaveBeenCalledWith(
          `server_id:${dto.server_id}`,
          1000
        );
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(redisMock.setExpiration).toHaveBeenCalledWith(
          `server_id:${dto.server_id}`,
          86400
        );
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(redisMock.pushToList).toHaveBeenCalledWith(
          `server_id:${dto.server_id}`,
          JSON.stringify({[dto.event_type]: dto.data})
        );
      }
    });
  });

  it("should log error when Redis throws an exception", async () => {
    const testData = {
      server_id: "server123",
      event_type: EventTypeEnum.SERVER_RESTART,
      data: {uptime: 31232, reason: "Update"},
    };

    if (redisMock) {
      redisMock.pushToList.mockRejectedValue(new Error("Redis error"));
    }
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
