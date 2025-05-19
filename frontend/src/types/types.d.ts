export interface IUser {
  _id: string;
  username: string;
  savedPasswords: ISavedPassword[];
}

interface ISavedPassword {
  _id: string;
  site: string;
  password: string;
  createdAt: string;
}
