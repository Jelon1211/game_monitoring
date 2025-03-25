import Sidebar from "@/components/layouts/Sidebar";
import { UserProvider } from "@/context/user-context";
import { withAuth } from "@workos-inc/authkit-nextjs";

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
