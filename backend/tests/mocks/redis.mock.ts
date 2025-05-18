import {RedisDataAccessFacade} from "../../src/data-sources/redis/redis-data-access-facade";

export const createRedisMock = (): jest.Mocked<RedisDataAccessFacade> => {
  return {
    trimList: jest.fn(),
    setExpiration: jest.fn(),
    pushToList: jest.fn(),
  } as unknown as jest.Mocked<RedisDataAccessFacade>;
};
