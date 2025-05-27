import { Route } from "@/enums/routes";
import { postgresHelper } from "@/lib/postgres/PostgresHelper";
import { handleAuth } from "@workos-inc/authkit-nextjs";

// Redirect the user to `/` after successful sign in
// The redirect can be customized: `handleAuth({ returnPathname: '/foo' })`
export const GET = handleAuth({
  returnPathname: `${Route.PANEL}${Route.DASHBOARD}`,
  async onSuccess({ user }) {
    try {
      await postgresHelper.transaction(async (client) => {
        await client.query(
          `
            INSERT INTO "user" (workos_user_id, account_type)
            VALUES ($1, $2)
            ON CONFLICT (workos_user_id) DO NOTHING;
            `,
          [user.id, "free"]
        );
      });
    } catch (err) {
      console.error("Error on insert user", err);
    }
  },
});
