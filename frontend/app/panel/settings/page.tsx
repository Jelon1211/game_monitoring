import GenerateTokenModal from "@/components/modal/GenerateTokenModal";
import { redirect } from "next/navigation";
import { getUserTokens } from "@/lib/postgres/queries/getUserToken";
import { withAuth } from "@workos-inc/authkit-nextjs";
import TokenCardWidget from "@/components/widgets/TokenCardWidget";
import LogOutButton from "@/components/buttons/LogOutButton";

export default async function SettingsPage() {
  const { user } = await withAuth();
  if (!user) {
    redirect("/");
  }
  const result = await getUserTokens(user.id);

  return (
    <div className="p-4">
      <div className="flex flex-col p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div className="flex gap-4 items-center">
          {result.length === 0 ? (
            <>
              <span>Generate your token</span>
              <GenerateTokenModal />
            </>
          ) : (
            <>
              {result.map((token) => (
                <TokenCardWidget key={token.id} token={token} />
              ))}
            </>
          )}
        </div>
        <div className="flex justify-end">
          <LogOutButton />
        </div>
      </div>
    </div>
  );
}
