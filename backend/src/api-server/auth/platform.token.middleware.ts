import {Express, Request, Response, NextFunction} from "express";
import ConfigBuilder from "../../config-builder/config-builder";
import {Config, User} from "../../config-builder/config.interface";
import {HttpException} from "../../exceptions/http.exception";
import {match} from "path-to-regexp";
import jwt from "jsonwebtoken";

export class PlatformTokenMiddleware {
  private readonly config: Config = ConfigBuilder.getConfig().config;

  constructor(private readonly app: Express) {}

  public init({excludedRoutes}: {excludedRoutes: string[]}) {
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      const isExcluded = excludedRoutes.some((route) => {
        const matcher = match(route, {decode: decodeURIComponent});
        return matcher(req.originalUrl);
      });

      if (isExcluded) {
        return next();
      }

      const token = req.headers["x-platform-token"];

      if (!token || typeof token !== "string") {
        return next(new HttpException("Missing x-platform-token header", 401));
      }

      try {
        const decoded = jwt.verify(token, this.config.secret.jwt) as User;
        req.user = {
          sub: decoded.sub,
          role: decoded.role,
          platform: decoded.platform,
        };
        next();
      } catch (err) {
        return next(new HttpException("Invalid platform token", 401));
      }
    });
  }
}
