interface IUser {
  _id: string;
  fullName: string;
  username?: string;
  avatar?: string;
  email?: string;
  employeeId?: string;
  position?: string;
  skills?: string[];
  role?: string;
  department?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
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
  