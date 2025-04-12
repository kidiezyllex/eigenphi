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

interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignedTo?: IUser;
  dueDate?: string;
}

interface IProjectMember {
  user: IUser;
  role: 'lead' | 'member';
  joinDate: string;
}

export interface IProject {
  _id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  members: IProjectMember[];
  gameGenre?: string;
  gamePlatform?: string;
  thumbnail?: string;
  tasks?: ITask[];
  createdAt: string;
  updatedAt: string;
}

export interface IProjectResponse {
  success: boolean;
  message: string;
  data: IProject;
}

export interface IProjectsListResponse {
  success: boolean;
  count: number;
  data: IProject[];
}

export interface IDeleteProjectResponse {
  success: boolean;
  message: string;
} 