export interface ICreateTask {
  title: string;
  description?: string;
  project: string;
  phase?: string;
  assignedTo?: string;
  startDate?: Date | string;
  dueDate?: Date | string;
  status?: string;
  priority?: string;
}

export interface IUpdateTask {
  title?: string;
  description?: string;
  phase?: string;
  assignedTo?: string;
  startDate?: Date | string;
  dueDate?: Date | string;
  status?: string;
  priority?: string;
  progress?: number;
  completedDate?: Date | string;
}

export interface ICreateTaskNote {
  content: string;
  taskId: string;
  isPersonal?: boolean;
}

export interface IUpdateTaskNote {
  content: string;
  isPersonal?: boolean;
}

export interface IGetTasksParams {
  project?: string;
  status?: string;
  phase?: string;
  assignedTo?: string;
} 