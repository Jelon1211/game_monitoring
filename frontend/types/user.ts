export interface User {
  object: "user";
  id: string;
  email: string;
  emailVerified: boolean;
  profilePictureUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  lastSignInAt: string | null;
  createdAt: string;
  updatedAt: string;
  externalId: string | null;
  metadata: Record<string, string>;
}
