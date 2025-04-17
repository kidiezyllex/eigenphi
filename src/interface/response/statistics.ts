// Interface cho thống kê tổng quan
export interface IOverviewStatistics {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  totalDocuments: number;
  totalForumPosts: number;
}

// Interface cho thống kê người dùng
export interface IUsersByDepartment {
  _id: string;
  count: number;
}

export interface IUsersByPosition {
  _id: string;
  count: number;
}

export interface IUsersByRole {
  _id: string;
  count: number;
}

export interface IUsersJoinedByMonth {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface IUserStatistics {
  usersByDepartment: IUsersByDepartment[];
  usersByPosition: IUsersByPosition[];
  usersByRole: IUsersByRole[];
  usersJoinedByMonth: IUsersJoinedByMonth[];
}

// Interface cho thống kê dự án
export interface IProjectsByStatus {
  _id: string;
  count: number;
}

export interface IProjectsCreatedByMonth {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface IProjectsByGenre {
  _id: string;
  count: number;
}

export interface IProjectsByPlatform {
  _id: string;
  count: number;
}

export interface IProjectStatistics {
  projectsByStatus: IProjectsByStatus[];
  projectsCreatedByMonth: IProjectsCreatedByMonth[];
  projectsByGenre: IProjectsByGenre[];
  projectsByPlatform: IProjectsByPlatform[];
}

// Interface cho thống kê tài liệu
export interface IDocumentsByType {
  _id: string;
  count: number;
  totalSize: number;
}

export interface IDocumentsByCategory {
  _id: string;
  count: number;
}

export interface IDocumentsUploadedByMonth {
  _id: {
    year: number;
    month: number;
  };
  count: number;
  totalSize: number;
}

export interface IDocumentStatistics {
  documentsByType: IDocumentsByType[];
  documentsByCategory: IDocumentsByCategory[];
  documentsUploadedByMonth: IDocumentsUploadedByMonth[];
}

// Interface cho thống kê diễn đàn
export interface ITopPoster {
  userId: string;
  username: string;
  fullName: string;
  postCount: number;
}

export interface IPostsPerMonth {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface ICommentsPerMonth {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface IForumStatistics {
  totalPosts: number;
  totalComments: number;
  postsPerMonth: IPostsPerMonth[];
  commentsPerMonth: ICommentsPerMonth[];
  topPosters: ITopPoster[];
} 