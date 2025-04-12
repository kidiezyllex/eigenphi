import { MenuItem } from '@/interface/types';
import {
  mdiAccountGroup,
  mdiFileDocument,
  mdiForum,
  mdiCommentTextMultiple,
  mdiCalendarMonth,
  mdiNoteText,
  mdiChartBar,
  mdiFileDocumentMultipleOutline,
  mdiClipboardListOutline,
} from '@mdi/js';

export const dashboardMenuItems: MenuItem[] = [
  {
    id: 'document',
    name: 'Quản lý tài liệu',
    path: '/dashboard/documents',
    icon: mdiFileDocument,
    subMenu: [
      {
        id: 'document-personal',
        name: 'Tài liệu cá nhân',
        path: '/dashboard/documents/personal',
      },
      {
        id: 'document-project',
        name: 'Tài liệu dự án',
        path: '/dashboard/documents/project',
      },
      {
        id: 'document-shared',
        name: 'Tài liệu được chia sẻ',
        path: '/dashboard/documents/shared',
      },
    ],
  },
  {
    id: 'forum',
    name: 'Diễn đàn dự án',
    path: '/dashboard/forum',
    icon: mdiForum,
    subMenu: [
      {
        id: 'forum-posts',
        name: 'Bài viết',
        path: '/dashboard/forum/posts',
      },
      {
        id: 'forum-my-posts',
        name: 'Bài viết của tôi',
        path: '/dashboard/forum/my-posts',
      },
      {
        id: 'forum-create',
        name: 'Tạo bài viết mới',
        path: '/dashboard/forum/create',
      },
    ],
  },
  {
    id: 'comments',
    name: 'Bình luận',
    path: '/dashboard/comments',
    icon: mdiCommentTextMultiple,
    subMenu: [
      {
        id: 'comments-task',
        name: 'Bình luận nhiệm vụ',
        path: '/dashboard/comments/task',
      },
      {
        id: 'comments-member',
        name: 'Bình luận thành viên',
        path: '/dashboard/comments/member',
      },
      {
        id: 'comments-post',
        name: 'Bình luận bài viết',
        path: '/dashboard/comments/post',
      },
    ],
  },
  {
    id: 'task',
    name: 'Nhiệm vụ thiết kế',
    path: '/dashboard/tasks',
    icon: mdiClipboardListOutline,
  },
  {
    id: 'schedule',
    name: 'Lịch trình làm việc',
    path: '/dashboard/schedule',
    icon: mdiCalendarMonth,
  },
  {
    id: 'notes',
    name: 'Ghi chú cá nhân',
    path: '/dashboard/notes',
    icon: mdiNoteText,
  },
];

export const adminMenuItems: MenuItem[] = [
  ...dashboardMenuItems,
  {
    id: 'user-management',
    name: 'Quản lý người dùng',
    path: '/dashboard/admin/users',
    icon: mdiAccountGroup,
  },
  {
    id: 'document-categories',
    name: 'Phân loại tài liệu',
    path: '/dashboard/admin/document-categories',
    icon: mdiFileDocumentMultipleOutline,
  },
  {
    id: 'statistics',
    name: 'Thống kê hệ thống',
    path: '/dashboard/admin/statistics',
    icon: mdiChartBar,
  },
]; 