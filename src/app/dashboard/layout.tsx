'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee');

  useEffect(() => {
    // Kiểm tra quyền của người dùng từ localStorage hoặc thông tin đăng nhập
    // Đây là ví dụ đơn giản, trong thực tế cần kiểm tra từ JWT token hoặc phiên đăng nhập
    const role = localStorage.getItem('userRole');
    if (role === 'admin') {
      setUserRole('admin');
    }
  }, []);

  return <DashboardLayout userRole={userRole}>{children}</DashboardLayout>;
} 