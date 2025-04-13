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

interface IAuthor {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface IUserComment {
  _id: string;
  content: string;
  author: IAuthor;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserCommentResponse {
  success: boolean;
  message: string;
  data: IUserComment;
}

export interface IUserCommentsListResponse {
  success: boolean;
  count: number;
  data: IUserComment[];
}

export interface IDeleteUserCommentResponse {
  success: boolean;
  message: string;
}
  