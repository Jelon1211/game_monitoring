import { SupportedPlatforms } from "@/enums/platforms";

export interface JwtPayload {
  platform: SupportedPlatforms.ROBLOX;
  name: string;
  description: string;
  user_id: string;
  role: string;
}
