import { Timestamp } from "firebase/firestore";

export interface UserInfo {
  name: string;
  email: string;
  community_code: string;
  created_at: Timestamp;
  role: "admin" | "general" | "guest";
}
