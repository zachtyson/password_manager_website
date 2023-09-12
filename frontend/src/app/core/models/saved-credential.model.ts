import {User} from "./user.model";

export interface Credential {
  id?: number;
  owner_id?: number;
  nickname?: string;
  username?: string;
  password?: string;
  email?: string;
  added_date?: Date;
  last_accessed_date?: Date;
  url?: string;
  shared_users?: User[];
  salt?: string;
}
