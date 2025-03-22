import Sidebar from "@/components/layouts/Sidebar";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { UserProvider } from "../context/user-context";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <UserProvider user={user}>
      <div>
        <Sidebar />
        <main className="p-4 sm:ml-64 mt-14">{children}</main>
      </div>
    </UserProvider>
  );
}
