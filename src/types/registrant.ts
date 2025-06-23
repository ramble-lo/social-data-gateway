
export interface Registrant {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  line_id?: string;
  is_resident: boolean;
  housing_location?: string;
  created_at: string;
  updated_at: string;
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
  submit_time: string;
  created_at: string;
}

export interface RegistrantWithHistory extends Registrant {
  history: RegistrationHistory[];
}
