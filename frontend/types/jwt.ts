import { SupportedPlatforms } from "@/enums/platforms";

export interface JwtPayload {
  platform: SupportedPlatforms.ROBLOX;
  name: string;
  description: string;
  user_id: string;
  role: string;
}

export interface JwtToken {
  id: number;
  user_id: number;
  token: string;
  name: string;
  platform: string;
  description: string;
  expire_at: string | Date;
  created: string | Date;
  modified: string | Date;
}
