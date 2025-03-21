import {
  getSignInUrl,
  getSignUpUrl,
  withAuth,
} from "@workos-inc/authkit-nextjs";
import Link from "next/link";

export default async function Home() {
  const { user } = await withAuth();
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return (
    <div className="text-2xl">
      {user ? (
        <>
          <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
          <Link href="/panel/dashboard">dashboard</Link>
        </>
      ) : (
        <div className="flex flex-col">
          <Link href={signInUrl}>Sign in</Link>
          <Link href={signUpUrl}>Sign up</Link>
        </div>
      )}
    </div>
  );
}
