interface IProjectMember {
  user: string;
  role?: 'lead' | 'member';
  joinDate?: Date;
}

export interface ICreateProject {
  name: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: string;
  members?: IProjectMember[];
  gameGenre?: string;
  gamePlatform?: string;
  thumbnail?: string;
}

export interface IUpdateProject {
  name?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: string;
  gameGenre?: string;
  gamePlatform?: string;
  thumbnail?: string;
}

export interface IAddProjectMember {
  userId: string;
  role?: 'lead' | 'member';
} 