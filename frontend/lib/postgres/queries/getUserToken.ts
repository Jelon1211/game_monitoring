import { postgresHelper } from "@/lib/postgres/PostgresHelper";

export async function getUserTokens(workosUserId: string) {
  const result = await postgresHelper.query(
    `
    SELECT user_jwt.*
    FROM "user"
    JOIN user_jwt ON user_jwt.user_id = "user".id
    WHERE "user".workos_user_id = $1
    `,
    [workosUserId]
  );

  return result;
}
