export interface ApiErrorResponse {
  error: string;
}

export interface LanguageSkill {
  language_type?: string;
  level?: string;
}

export interface UserInfo {
  id?: string;
  name?: string;
  profileImage?: string;
  birth_date?: string;
  country_id?: number;
  created_at?: string;
  user_type?: 'user' | 'company' | 'admin';
}
