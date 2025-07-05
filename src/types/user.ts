import { Timestamp } from "firebase/firestore";

export interface UserInfo {
  name: string;
  email: string;
  created_at: Timestamp;
  role: "admin" | "general" | "guest";
}
