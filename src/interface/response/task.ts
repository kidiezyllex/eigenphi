interface IUser {
  _id: string;
  fullName: string;
  avatar?: string;
  email?: string;
}

interface IProject {
  _id: string;
  name: string;
  status?: string;
  members?: Array<{
    user: string;
    role: string;
  }>;
}

interface IComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface INote {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  isPersonal?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  project: IProject;
  phase?: string;
  assignedTo: IUser;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  status: string;
  priority: string;
  progress?: number;
  comments?: IComment[];
  notes?: INote[];
  createdAt: string;
  updatedAt: string;
}

export interface ITaskResponse {
  success: boolean;
  message: string;
  data: ITask;
}

export interface ITasksListResponse {
  success: boolean;
  count: number;
  data: ITask[];
}

export interface IDeleteTaskResponse {
  success: boolean;
  message: string;
}

export interface ITaskNoteResponse {
  success: boolean;
  message: string;
  data: INote;
}

export interface IDeleteTaskNoteResponse {
  success: boolean;
  message: string;
} 