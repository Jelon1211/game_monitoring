"use client";

import { User } from "@/types/user";
import { createContext, useContext, useState } from "react";

const UserContext = createContext<{ user: User | null }>({ user: null });

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const [userState, setUserState] = useState<User | null>(user);

  return (
    <UserContext.Provider value={{ user: userState }}>
      {children}
    </UserContext.Provider>
  );
}
