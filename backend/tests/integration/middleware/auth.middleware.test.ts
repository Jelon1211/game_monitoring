import express, {Express, Request, Response, NextFunction} from "express";
import request from "supertest";
import {AuthMiddleware} from "../../../src/api-server/auth/auth.middleware";

const app: Express = express();
app.use(express.json());

describe("AuthMiddleware", () => {
  beforeEach(() => {
    const authMiddleware = new AuthMiddleware(app);
    authMiddleware.init({excludedRoutes: ["/public"]});

    app.get("/secure", (_req: Request, res: Response) => res.send("Secure"));
    app.get("/public", (_req: Request, res: Response) => res.send("Public"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      res.status(err.status || 500).json({message: err.message});
    });
  });

  it("should pass requests to excluded route", async () => {
    const response = await request(app).get("/public");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Public");
  });

  it("should pass reqeusts with valid token", async () => {
    const response = await request(app)
      .get("/secure")
      .set("Authorization", "Bearer dev-token");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Secure");
  });

  it("should block requests without auth header", async () => {
    const response = await request(app).get("/secure");

    expect(response.status).toBe(401);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.message).toBe("Not authorized");
  });

  it("should block requests with invalid token", async () => {
    const response = await request(app)
      .get("/secure")
      .set("Authorization", "Bearer wrong-token");

    expect(response.status).toBe(401);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.message).toBe("Not authorized");
  });
});
