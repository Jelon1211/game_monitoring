import {AppLogger} from "../../src/loggers/logger-service/logger.service";

export const createLoggerMock = (): jest.Mocked<AppLogger> => {
  return {
    log: jest.fn(),
  } as unknown as jest.Mocked<AppLogger>;
};

jest.mock("../../src/loggers/logger-service/logger.service", () => ({
  AppLogger: {
    getInstance: jest.fn(() => createLoggerMock()),
  },
}));
