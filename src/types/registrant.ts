import { Timestamp } from "firebase/firestore";

export interface Registrant {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  line_id?: string;
  is_resident: boolean;
  housing_location?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface RegistrationHistory {
  id: string;
  registrant_id: string;
  activity_name: string;
  age?: string;
  children_count?: string;
  sports_experience?: string;
  injury_history?: string;
  info_source?: string;
  suggestions?: string;
  submit_time: Timestamp;
  created_at: Timestamp;
}

export interface RegistrantWithHistory extends Registrant {
  history: RegistrationHistory[];
}
