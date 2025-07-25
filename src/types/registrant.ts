import { Timestamp } from "firebase/firestore";

export interface Registrant {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  age?: string;
  line_id?: string;
  residient_type?: ResidentStatusType;
  created_at: Timestamp;
  updated_at: Timestamp;
}
export interface RegistrantFromFirebase extends Registrant {
  id: string;
}

export interface Registration {
  name: string;
  email: string;
  surveycake_hash: string;
  phone: string;
  gender?: string;
  residient_type?: ResidentStatusType;
  registrant_id: string;
  activity_name: string;
  age?: string;
  children_count?: string;
  sports_experience?: string;
  injury_history?: string;
  info_source?: string;
  suggestions?: string;
  line_id?: string;
  housing_location?: string;
  submit_time: Timestamp;
  created_at: Timestamp;
}

export interface RegistrationFromFirebase extends Registration {
  id: string;
}

export enum ResidentStatusEnum {
  xinglong = "是，我是興隆社宅2區的住戶",
  wenshan = "否，我是文山區鄰近居民",
  otherTaipeiSocialHousing = "否，我是其他臺北市社會住宅的住戶",
  other = "以上皆非",
}
export enum ResidentStatusDisplayEnum {
  xinglong = "興隆D2",
  wenshan = "文山居民",
  otherTaipeiSocialHousing = "其他社宅",
  other = "一般市民",
}

export type ResidentStatusType =
  | "xinglong"
  | "wenshan"
  | "otherTaipeiSocialHousing"
  | "other";
