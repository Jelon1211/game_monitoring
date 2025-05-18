import request from "supertest";
import express, {Express} from "express";
import "../../mocks/logger.mock";
import {RobloxTrackerRouter} from "../../../src/api-server/roblox-tracker/router/roblox-tracker.router";
import {
  Platform,
  Routes,
} from "../../../src/api-server/main-router/routes.enum";
import {EventTypeEnum} from "../../../src/api-server/roblox-tracker/enums";
import {MainRouter} from "../../../src/api-server/main-router/main.router";
import {HttpExceptionHandlerService} from "../../../src/api-server/exception-handling/http-exception-handler/http.exception-handler.service";
import testCases from "../../utils/roblox-tracker.test-cases";

const app: Express = express();
app.use(express.json());

const mainRouter = new MainRouter(app);
mainRouter.init([new RobloxTrackerRouter().router]);

new HttpExceptionHandlerService(app).init();

describe("RobloxTrackerRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({dto}) => {
    it(`should return 200 for valid ${dto.event_type} request`, async () => {
      const response = await request(app)
        .post(`${Routes.V1}${Platform.ROBLOX}/${dto.event_type}`)
        .send(dto);

      expect(response.status).toBe(200);
    });
  });

  it("should return 400 for invalid request", async () => {
    const response = await request(app)
      .post(`${Routes.V1}${Platform.ROBLOX}/${EventTypeEnum.SERVER_RESTART}`)
      .send({invalidField: "test"});

    expect(response.status).toBe(400);
  });

  it("should return 500 when hitting the error trigger endpoint", async () => {
    const response = await request(app).get("/trigger-error");

    expect(response.status).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.error.message).toBe("Internal server error");
  });
});
