export interface IUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface IUserResponse {
  message: string;
  data: IUser;
}

export interface IUsersListResponse {
  message: string;
  data: IUser[];
}

export interface IDeleteUserResponse {
  message: string;
}
  