import jwt, { SignOptions } from "jsonwebtoken";

export class JwtService {
  private secret: string;

  constructor(secret: string) {
    if (!secret) throw new Error("JWT secret is required");
    this.secret = secret;
  }

  sign(payload: object, options: SignOptions = { expiresIn: "90D" }): string {
    return jwt.sign(payload, this.secret, options);
  }
}

export const jwtService = new JwtService(process.env.JWT_SECRET!);
