"use server";

import { JwtPayload } from "jsonwebtoken";
import { jwtService } from "../auth/jwt";
import { postgresHelper } from "../postgres/PostgresHelper";

export async function generateJWT(payload: JwtPayload) {
  const token = jwtService.sign(
    {
      sub: payload.user_id,
      role: payload.role,
      platform: payload.platform,
    },
    { expiresIn: "90d" }
  );

  try {
    await postgresHelper.transaction(async (client) => {
      await client.query(
        `
        INSERT INTO user_jwt (
          user_id,
          token,
          name,
          platform,
          description,
          expire_at
        )
        SELECT
          u.id,
          $1,
          $2,
          $3,
          $4,
          now() + interval '90 days'
        FROM "user" u
        WHERE u.workos_user_id = $5
        `,
        [
          token,
          payload.name,
          payload.platform,
          payload.description,
          payload.user_id,
        ]
      );
    });
  } catch (err) {
    console.error("Error inserting user_jwt", err);
  }
}
